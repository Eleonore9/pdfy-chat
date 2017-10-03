var express = require('express');
var app = express();
var parser = require("body-parser");
var jsPDF = require("node-jspdf");


app.set('port', (process.env.PORT || 5000));


// Homepage
app.get('/', function(request, response) {
  response.send('Hello World!');
});

// Test route for pdf creation
app.get('/test-pdf', function(request, response) {
  var doc = jsPDF();
  doc.text(20, 20, 'Hello, world.');
  console.log("pdf doc created!");
  //doc.save('Test.pdf', function(err){console.log('saved!');});
  response.send('Data written in a pdf file!');
});

// Allow external app to post JSON
// Parse application/json
app.use(parser.json());

app.post('/create-pdf', function(request, response) {
  // I expected to receive an object with a list of messages
  var messages = request.body["messages"];
  // for each message in messages, retrieve message["data"][0]["text"]
  var text = [];
  for (var i = 0; i < messages.length; i++){
    text.push(messages[i]["data"][0]["text"]);
  }
  console.log(text)
  var doc = jsPDF();
  doc.text(4, 7, text);
  console.log("pdf doc created!");
  doc.save('Test3.pdf', function(err){console.log('saved!');});
  response.send('Data written in a pdf file!');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
