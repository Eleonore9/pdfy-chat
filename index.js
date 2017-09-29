var express = require('express');
var app = express();
var parser = require("body-parser");
//var jsPDF = require("node-jspdf");


app.set('port', (process.env.PORT || 5000));


// Homepage
app.get('/', function(request, response) {
  response.send('Hello World!')
});

// Test route for pdf creation
// app.get('/test-pdf', function(request, response) {
//   var doc = jsPDF();
//   doc.text(20, 20, 'Hello, world.');
//   console.log("pdf doc created!")
//   //doc.save('Test.pdf', function(err){console.log('saved!');});
//   response.send('Data written in a pdf file!')
// })

// Allow external app to post JSON
// Parse application/json
app.use(parser.json())

app.post('/create-pdf', function(request, response) {
  console.log(request.body);
  response.send('Data received!');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
