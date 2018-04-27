// mailer.js
// var exports = module.exports = {};

var nodemailer = require("nodemailer");

// Config settings for the SMTP transporter using Gmail SMTP server
var smtpConfig = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
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
