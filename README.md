# ProTechMe PDF conversion

**ProTechMe** is a chat bot to collect information for protective order. Read more [here](https://github.com/TechForJustice/protechme).

The **ProTechMe PDF conversion** is a Node.js application that gets messages (JSON data) from a **ProTechMe** chat bot and converts the conversation into a PDF file.


## Features
### Overview
* Parsing of JSON data
* Due to the use of [jsPDF](http://rawgit.com/MrRio/jsPDF/master/docs/index.html) library, format the messages to:
  * Separate questions from the bot and answers from the user
  * Build the content of the document line by line
* Coloring the questions and answers differently
* Writing a PDF document
* Returning a link to the downlodable document
* Sending out an email with the PDF document as an attachement (if applicable)
* Deleting the document after 5 minutes

### Routes
* `/`: The homepage will display information (most likely from the repository Readme file)
* `/create-pdf`: The route requested by the chat bot accompanied by JSON data in the body of the request. The text of the chat messages in the JSON data will be written into a PDF document.
*Note:* depending on the previous message in the conversation, the chat bot will receive back a (temporarily) link to the downloadable PDF or the link and an email will be sent to an email address communicated by the user in the conversation (with the PDF file as an attachment).
* `/file/:name`: The route used to serve the (temporarily) downloadable PDF file

## Development
* Make sure you have a version of Node greater than 4 installed with the command `$ node -v`, and have npm installed.
* Clone the repository `$ git clone git@github.com:TechForJustice/protechmepdfconversion.git`.
* Install all dependencies locally with `npm install`
* Run it locally with `node index.js local`


## Description
* **`index.js`** - Defines the routes of the application and especially `/create-pdf` that is called by the bot with JSON data to create a PDF. Note: the PDF file is currently only store for 5 minutes.
* **`parseMessages.js`** - Takes in the messages received from the bots and shape them so they can be written to a file using the jsPDF library.
* **`bot.js`** - Keep track of the code for the chat bot Node module that post a request to the `/create-pdf` route.
* **`tmp/`** - Folder to temporarily store the PDF files (the app expects this directory to be present)
* **`packages.json`** - Defines the dependencies
* **`app.json`** - Metadata for the application
* **`Procfile`** - Metadata for Heroku
