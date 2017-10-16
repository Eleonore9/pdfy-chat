var express = require("express");
var app = express();
var parser = require("body-parser");
var jsPDF = require("node-jspdf");
var prepmessages = require("./parseMessages");
//var btoa = require('btoa');


app.set('port', (process.env.PORT || 5000));


// Homepage
app.get('/', function(request, response) {
  response.send('Hello World!');
});

// Allow external app to post JSON
// Parse application/json
app.use(parser.json());

// Route to receive JSON data for a chat conversation
// and return a link to a pdf file containing the conversation
app.post('/create-pdf', function(request, response) {
  // I expected to receive an object with a list of messages
  var messages = request.body["data"];
  var text = prepmessages.processMessages(messages);
  var questions = text['questions'];
  var answers = text['answers'];
  var doc = jsPDF();
  for (var i = 0; i < questions.length; i++){
    doc.setTextColor("#75777f");
    var topQuestion = 10 + i * 27;
    doc.text(6, topQuestion, questions[i]);
    doc.setTextColor("#11509e");
    var topAnswer = topQuestion + 2 + questions[i].length * 6;
    doc.text(6, topAnswer, answers[i]);
  }
  console.log("pdf doc created!");
  // doc.output("datauristring");
  doc.save('Test.pdf', function(err){console.log('saved!');});
  response.send("done!");
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
