# ProTechMe PDF conversion

**ProTechMe** is a chat bot to collect information for protective order. Read more [here](https://github.com/TechForJustice/protechme).

The **ProTechMe PDF conversion** is a Node.js application that gets messages (JSON data) from a **ProTechMe** chat bot and converts the conversation into a PDF file.

## Table of content
* [Features](#features)
  * [Overview](#overview)
  * [Routes](#routes)
* [Development](#development)
  * [Code](#code)
  * [Deploy](#deploy)
* [Description](#description)
* [Useful links for contributors](#useful-links-for-contributors)


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
### Code
All the code needed for this project is available in [this](https://github.com/TechForJustice/protechmepdfconversion) repository.
For more details, see the [Description](#description) paragraph.
* Make sure you have a version of Node greater than 4 installed with the command `$ node -v`, and have npm installed.
* Clone the repository `$ git clone git@github.com:TechForJustice/protechmepdfconversion.git`.
* Install all dependencies locally with `npm install`
* Run it locally with `node index.js local`

### Deploy
The application is hosted on Heroku. Deploying it is as easy as `git push heroku master`.


**Note:**
A few [configuration variables](https://devcenter.heroku.com/articles/config-vars) are set that are used by both the application and the chatbot.
Those variables are:
A password for encryption purpose (`CRYPTO_SECRET`), credentials for the emails' sender (`EMAIL_USERNAME`, `EMAIL_PASSWORD`), an address to send an email for assistance (`EMAIL_ASSISTANCE`).

* When working locally, you can set them using `$ export VARIABLE_NAME=VARIABLE_VALUE`.
* For the application, the easiest way to edit those are via Heroku's dashboard:
1) Access the Heroku dashboard [`Settings`](https://dashboard.heroku.com/apps/protechmepdfconversion/settings) tab (assuming you have the credentials to do so),
2) On the page, look for `Config variables`,
3) Click on `Reveal config variables`. There you can edit existing variables or add new ones if needed.

## Description
* **`index.js`** - Defines the routes of the application and especially `/create-pdf` that is called by the bot with JSON data to create a PDF. Note: the PDF file is currently only store for 5 minutes.
* **`parseMessages.js`** - Takes in the messages received from the bots and shape them so they can be written to a file using the jsPDF library.
* **`bot.js`** - Keeps track of the code for the chat bot Node module that post a request to the `/create-pdf` route. **Note: The configuration variables are missing on purpose. DO NOT COMMIT THEM.**
* **`mailer.js`** - Uses the [`nodemailer`](https://nodemailer.com/about/) package to send out emails
* **`utils.js`** - Uses the [`crypto`](https://nodejs.org/api/crypto.html#crypto_crypto) Node module to keep the user email address anonymous while it is sent between the chatbot and this application
* **`tmp/`** - Folder to temporarily store the PDF files (the app expects this directory to be present)
* **`views/readme.html`** - An html template for the application homepage. It contains the info on the repo's Readme and was created using the package [markdown-to-html](https://www.npmjs.com/package/markdown-to-html).
* **`packages.json`** - Defines the dependencies
* **`app.json`** - Metadata for the application
* **`Procfile`** - Metadata for Heroku



## Useful links for contributors
**Heroku**
	* https://devcenter.heroku.com/articles/getting-started-with-nodejs
	* https://devcenter.heroku.com/articles/config-vars

**jsPDF**
	* https://parall.ax/products/jspdf
	* http://rawgit.com/MrRio/jsPDF/master/docs/index.html

**Motion.ai**
	* https://docs.motion.ai/docs/what-are-modules
	* https://github.com/MotionAI/nodejs-samples

**NodeMailer**
	* https://nodemailer.com/about/
	* https://community.nodemailer.com/

**Crypto**
	* https://nodejs.org/api/crypto.html#crypto_crypto
	* http://lollyrock.com/articles/nodejs-encryption/
