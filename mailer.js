// mailer.js
// var exports = module.exports = {};

var nodemailer = require("nodemailer");

// Config settings for the SMTP transporter using Gmail SMTP server
var smtpConfig = {
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
}

var emailSubject = "Your conversation for a protective order";

var emailContent = "Hello,\n\nPlease, find attached a copy of the conversation containing your protective order information.\n\nKind regards,\n\nThe ProTechMe project";


exports.sendEmail = function(to, fileURL) {
  // Compose the email
  var mailOptions = {
    to      : to,
    subject : emailSubject,
    text    : emailContent,
    attachments: [{href: fileURL}]
  };

  // Create the SMTP transporter
  var smtpTransporter = nodemailer.createTransport(smtpConfig);

  // Send the email
  smtpTransporter.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log("Message sent!");
    }
  });
}
