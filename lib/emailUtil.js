'use strict';
var nodemailer = require('nodemailer');
var Q = require('q');

var transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_SERVER,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PSWD
    }
});

function sendEmail(options) {
  var deferred = Q.defer();

  options.from = options.from || 'Pirate Party <membership@pirateparty.org.au>'; //Take this from config instead

  transporter.sendMail(options, function(error, info){
      if(error){
          deferred.reject(new Error(error));
      } else {
        deferred.resolve('Message sent: ' + info.response);
      }
  });

  return deferred.promise;
}

var sendHtmlEmail = function (options) {
  let to = options.to instanceof Array ? options.to : [options.to];

  var emailOptions = {
    from: options.from,
    to: to,
    subject: options.subject,
    html: options.body
  };

  return sendEmail(emailOptions);
};


var sendPlainTextEmail = function (options) {
  let to = options.to instanceof Array ? options.to : [options.to];

  var emailOptions = {
    from: options.from,
    to: to,
    subject: options.subject,
    text: options.body
  };

  return sendEmail(emailOptions);
};

module.exports = {
  sendHtmlEmail: sendHtmlEmail,
  sendPlainTextEmail: sendPlainTextEmail
};