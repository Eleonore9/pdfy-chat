## ProTechMe PDF conversion

**ProTechMe** is a chat bot to collect information for protective order. Read more [here](https://github.com/TechForJustice/protechme).

The **ProTechMe PDF conversion** is a Node.js application that gets messages (JSON data) from a **ProTechMe** chat bot and converts the conversation into a PDF file.


### Features
* Parsing of JSON data

Due to the use of [jsPDF](http://rawgit.com/MrRio/jsPDF/master/docs/index.html) library, format the messages to:
* Separate questions from the bot and answers from the user
* Build the content of the document line by line

* Color the questions and answers differently
* Write a PDF document
* Returns a link to the downlodable document
* Deletes the document after 5 minutes


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
