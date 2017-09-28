exports.handler = (event, context, callback) => {

    // VIEW DOCS HERE:  https://github.com/MotionAI/nodejs-samples

    /* "event" object contains payload from Motion AI
        {
            "from":"string", // the end-user's identifier (may be FB ID, email address, Slack username etc, depends on bot type)
            "session":"string", // a unique session identifier
            "botId":"string", // the Motion AI ID of the bot
            "botType":"string", // the type of bot this is (FB, Slack etc)
            "customPayload":"string", // a developer-defined payload for carrying information
            "moduleId":"string", // the current Motion AI Module ID
            "moduleNickname":"string", // the current Motion AI Module's nickname
            "inResponseTo":"string", // the Motion AI module that directed the conversation flow to this module
            "reply":"string", // the end-user's reply that led to this module
            "result":"string" // any extracted data from the prior module, if applicable,
            "replyHistory":"object" // an object containing the current session's conversation messages
            "nlpData":"object" // stringified NLP data object parsed from a user's message to your bot if NLP engine is enabled
            "customVars":"string" // stringified object containing any existing customVars for current session
            "fbUserData":"string" // for Messenger bots only - stringified object containing user's meta data - first name, last name, and id
            "attachedMedia":"string" // for Messenger bots only - stringified object containing attachment data from the user
        }
    */

    // this is the object we will return to Motion AI in the callback
    var responseJSON = {
        "response": "", // what the bot will respond with
        "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
        "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
        "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
        "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
        "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
        "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
    }


    var request = require("request");

    request("https://api.motion.ai/getConversations?key=1829386e6b4284872083e425c3d1d54e&session=" + event.session,

    function (error, response, body) {
    if (error) {
      console.log('MotionAI Error: ' + error.toString());
      throw new Error(error);
    }
    var data = JSON.parse(body);
    // console.log("msg is: " + data.messages[0].text);
    //console.log("msg is: " + data.messages[1].text);
    console.log("length is: " + data.messages.length + "\n" + "messages are: " + data.messages + "\n" + "data is:" + data);

    // send JSON data to the 'protechmepdfconversion' app
    var options = {
        uri: 'http://protechmepdfconversion.herokuapp.com/create-pdf',
        method: 'POST',
        json: {"data": data.messages}
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log('MotionAI Error: ' + error.toString());
            throw new Error(error);
        }
    });

    responseJSON.response = body;

    callback(null, responseJSON);
    //callback to return data to Motion AI (must exist, or bot will not work)
  //});

  });

};
