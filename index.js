var express = require('express');
var app = express();
var parser = require("body-parser");

app.set('port', (process.env.PORT || 5000));


// Test route
app.get('/', function(request, response) {
  response.send('Hello World!')
});


// Allow external app to post JSON
// Parse application/json
app.use(parser.json())

app.post('/create-pdf', function(request, response) {
  console.log(request.body);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
