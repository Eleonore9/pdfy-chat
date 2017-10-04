var express = require("express");
var app = express();
var parser = require("body-parser");
var jsPDF = require("node-jspdf");
var prepmessages = require("./parseMessages");


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
  var doc = jsPDF();
  //doc.setTextColor("#273359");
  doc.text(4, 7, text.slice(0, 6)).setTextColor("#adb5bd"); //light grey
  doc.text(4, 50, text.slice(6)).setTextColor("#214cc4"); // dark blue
  //doc.text(4, 7, text).setTextColor();
  console.log("pdf doc created!");
  doc.output("bloburl");
  //doc.save('Test.pdf', function(err){console.log('saved!');});
  response.send('Data written in a pdf file!');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
