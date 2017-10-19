var express = require("express");
var app = express();
var parser = require("body-parser");
var jsPDF = require("node-jspdf");
var prepmessages = require("./parseMessages");
const path = require('path');
const fs = require('fs');


app.set('port', (process.env.PORT || 5000));


// Homepage
app.get('/', function(request, response) {
  response.send('Hello World!');
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
// Note: Below, Qs = questions and As = answers
app.post('/create-pdf', function(request, response) {

  // I expected to receive an object with a list of messages
  var messages = request.body["data"];
  var session = messages[0]["session"];
  var text = prepmessages.processMessages(messages);  // This returns an obj w/ Qs and As
  var questions = text['questions']; // Select the array of Qs
  var answers = text['answers']; // Select the array of As
  var doc = jsPDF();

  for (var i = 0; i < questions.length; i++){ // Build the pdf document
    doc.setTextColor("#75777f"); // Set a grey for Qs
    var topQuestion = 10 + i * 32; // Set how high Qs are located on the page
    doc.text(6, topQuestion, questions[i]); // Write down Qs
    doc.setTextColor("#11509e"); // Set a blue for the As
    var topAnswer = topQuestion + 3 + questions[i].length * 6.6; // Set how high As are located on the page
    doc.text(6, topAnswer, answers[i]); // Write down As
  }

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
  var hostname = request.protocol + "://" + request["headers"]["host"];
  response.send(hostname + '/file/' + fileName);

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
