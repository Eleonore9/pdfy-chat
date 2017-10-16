// parseMessages.js
// var exports = module.exports = {};

exports.parseMessage = function(message){
  // Takes in a message string and split it by line.
  // Return a list of strings w/ 1 string per line.
  var cleanedMessage = message.replace("::next::", '');
  return cleanedMessage.split("\n");
}


exports.processMessages = function(messages){
  // Takes in a object containing a whole chat conversation.
  // For each message, it retrieves the text.
  // Returns a list of messages strings to become pdf content.
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
  //console.log(pdf_content);
  return pdf_content;
}



// WIP split by line: split after ~100 chars where there's a space
var testString = "Thank you for taking the time to speak with me. I know that it can be hard to talk about something like this, but by sharing your info with me I will be able collect everything we discussed and put it into a document for you to share with your local legal aid organization or the Harris County DA's office, either by email or in person.\n::next::\nWhat is your email address?";

//console.log(testString.substr(0, 100));

// Idea: find the index of blank space. Split on spaces that are close to multiples of 100.
