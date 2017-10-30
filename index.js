var express = require("express");
var app = express();
var parser = require("body-parser");
var jsPDF = require("node-jspdf");
var prepmessages = require("./parseMessages");
var mailer = require("./mailer");
var utils = require("./utils");

const path = require('path');
const fs = require('fs');


app.set('port', (process.env.PORT || 5000));


// Homepage
app.get('/', function(request, response) {
  response.send('Welcome to ProTechMe PDF conversion tool!\nCheck this <a href="https://github.com/TechForJustice/protechmepdfconversion">link</a> for more info.');
});


// Route to download a pdf file
app.use(express.static('tmp'))


// Route to view downloadable pdf doc
app.get('/file/:name', function (request, response, next) {

    var options = {
      root: __dirname + '/tmp/',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    var fileName = request.params.name;
    response.sendFile(fileName, options, function (err) {
      if (err) {
	next(err);
      } else {
	console.log('Sent:', fileName);
      }
    });
  });


// Allow external app to post JSON
// Parse application/json
app.use(parser.json());


// Route to receive JSON data for a chat conversation
// and return a link to a pdf file containing the conversation
// Note1: Below, Qs = questions and As = answers
// Note2: The pdf file is deleted 5 minutes after it's creation
// It's done in this route as I didn't find a way to redirect to a delete request
app.post('/create-pdf', function(request, response) {
  var sendEmail = utils.decrypt(request.body.email); // This can be either "no" or the user email address

  // I expected to receive an object with a list of messages
  var messages = request.body.data;
  var session = messages[0]["session"];
  var text = prepmessages.processMessages(messages);  // This returns an obj w/ Qs and As
  var questions = text.questions; // Select the array of Qs
  var answers = text.answers; // Select the array of As

  // Create an array that combines Qs and As
  var fileContent = [];
  for (var i = 0; i < questions.length; i++){
    fileContent.push.apply(fileContent, questions[i]);
    fileContent.push.apply(fileContent, answers[i]);
  }

  // Create the PF document
  var doc = jsPDF();
  prepmessages.splitPages(doc, fileContent);

  // Add properties to the file
  doc.setProperties({
    title: 'Protechme',
    subject: 'Chatbot conversation',
    author: 'user',
    keywords: session,
    creator: 'TechForJustice'
  });
  // Save file and send the link back
  var fileName = session + '.pdf';
  var filePath = 'tmp/' + fileName;
  doc.save(filePath, function(err){console.log('Pdf file saved at ' + filePath);});
  var fileLink = express.static(path.join(__dirname, filePath));
  var hostname = request.protocol + "://" + request["headers"]["host"]; // Haven't found a better way of returning the hostname (either 'http://localhost:5000/' or 'http://protechmepdfconversion.herokuapp.com/')
  var pdfURL = hostname + '/file/' + fileName;
  // Building the response as a JSON object
  var responseToSend = {link: pdfURL}

  if(sendEmail !== "No" || sendEmail !== "no" || sendEmail !== "Nope" || sendEmail !== "nope"){
    mailer.sendEmail(sendEmail, pdfURL);
    responseToSend.email = "sent";
  }

  response.json(responseToSend);

  setTimeout(function() {
    // Delete pdf file after 5 minutes
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log('Successfully deleted ' + filePath);
    });
  }, 300000);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
