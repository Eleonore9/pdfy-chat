// parseMessages.js
// var exports = module.exports = {};


exports.splitLines = function(oldArray, newArray){
  // Takes in an array of words and an empty array.
  // Returns the second array containing strings of
  // around 60 characters that represent the lines
  // for the future pdf file.
  var count = 0; var i = 0; var store = "";
    if (oldArray.length === 0){
      return newArray;
    }
    else {
      while ((count < 60) && (i < oldArray.length)){
	store = store + oldArray[i] + " ";
	count += oldArray[i].length;
	i++;
      }
      newArray.push(store);
      exports.splitLines(oldArray.slice(i), newArray);
      return newArray;
  }
}

exports.parseMessage = function(message){
  // Takes in a message string and split it by line.
  // Return an array of strings w/ 1 string per line.
  var cleanedMessage = message.replace("::next::", '');
  var linesArray = [];
  var wordsArray = cleanedMessage.split(/\s+/); // split on all spaces

  return exports.splitLines(wordsArray, linesArray);
}


exports.processMessages = function(messages){
  // Takes in a object containing a whole chat conversation.
  // For each message, it retrieves the text.
  // Returns an array of messages strings to become pdf content.
  var pdf_content = {'questions': [],
		     'answers': []};
  // The first message contains only json in the text field
  messages = messages.slice(start=1);
  // The array of messages needs to be reversed
  messages = messages.reverse();
  // I expect the first message to be a question
  for (var i = 0; i < messages.length; i++){
    message = []
    if (i % 2 == 0) {
      message.push("\nQuestion: ");
      var messageLines = exports.parseMessage(messages[i]["text"]);
      message.push.apply(message, messageLines);
      pdf_content['questions'].push(message);
    } else {
      message.push("\nAnswer: ");
      var messageLines = exports.parseMessage(messages[i]["text"]);
      message.push.apply(message, messageLines);
      pdf_content['answers'].push(message);
    }
  }
  return pdf_content;
}
