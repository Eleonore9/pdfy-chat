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

    var optionsHeroku = {
        uri: "https://api.heroku.com/apps/protechmepdfconversion/config-vars",
        method: "GET",
        headers: {
            accept: "application/vnd.heroku+json; version=3"
        },
        auth: {user: "",
               pass: ""}
    };

    request(optionsHeroku, function (error, response, body) {
        if (error) {
            console.log('Heroku API Error: ' + error.toString());
            throw new Error(error);
        }
        var data = JSON.parse(body);
        var secret = data["CRYPTO_SECRET"];

        var crypto = require('crypto');
        var algorithm = 'aes-256-ctr';
        var encrypt = function(text) {
            var cipher = crypto.createCipher(algorithm, secret);
            var crypted = cipher.update(text,'utf8','hex');
            crypted += cipher.final('hex');
            return crypted;
        }

        var emailAddress = encrypt(event.result);


    request("https://api.motion.ai/getConversations?key=&session=" + event.session,

    function (error, response, body) {
    if (error) {
      console.log('MotionAI Error: ' + error.toString());
      throw new Error(error);
    }
    var data = JSON.parse(body);

    // send JSON data to the 'protechmepdfconversion' app
    var options = {
        uri: 'http://protechmepdfconversion.herokuapp.com/create-pdf',
        method: 'POST',
        json: {
            "email": emailAddress,
            "data": data.messages
            }
    };

    request(options, function (error, res, body) {
        if (error) {
            console.log('MotionAI Error: ' + error.toString());
            throw new Error(error);
        }
        // Response is a JSON object containing a 'link' key for the pdf link
        // and potentially a 'email' key if an email was sent
        var pdfLink = res.body.link;
        if (res.body.email){
            responseJSON.response = "An email was sent out to " + event.result + ".\nYou can also download a PDF of the conversation <a target='_blank' href='" + pdfLink + "'>here</a>.";
            callback(null, responseJSON);
        } else {
        responseJSON.response = "Download a PDF of the conversation <a target='_blank' href='" + pdfLink + "'>here</a>";
        callback(null, responseJSON);
        }
    });

  });

    });

};
