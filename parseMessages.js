// parseMessages.js
// var exports = module.exports = {};


exports.splitPages = function(PDFdoc, textArray){
  // Takes in a jsPDF object and an array of text content
  // Creates pagination and colors Qs and As differently
  var i = 0; var topText = 7; var count = 0;
  if (textArray.length === 0){
    return PDFdoc;
  } else {
    while (count < 30 && i < textArray.length){
      if (textArray[i] == "Question: ") {
	PDFdoc.setTextColor("#75777f");
	topText += 10;
      } else if (textArray[i] == "Answer: ") {
	PDFdoc.setTextColor("#11509e");
	topText += 10;
      } else { topText += 8; }

    PDFdoc.text(12, topText, textArray[i]);
    count++;
    i++;
    }
    if (i != textArray.length) {
      PDFdoc.addPage();
    }
  return exports.splitPages(PDFdoc, textArray.slice(i));
  }
}

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
      while ((count < 52) && (i < oldArray.length)){
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
  var pdfContent = {'questions': [],
		     'answers': []};
  // The array of messages needs to be reversed
  messages = messages.reverse();
  // I expect the first message to be a question
  for (var i = 0; i < messages.length; i++){
    message = []
    if (i % 2 == 0) {
      message.push("Question: ");
      var messageLines = exports.parseMessage(messages[i]["text"]);
      message.push.apply(message, messageLines);
      pdfContent['questions'].push(message);
    } else {
      message.push("Answer: ");
      var messageLines = exports.parseMessage(messages[i]["text"]);
      message.push.apply(message, messageLines);
      pdfContent['answers'].push(message);
    }

  }
return pdfContent;
}
