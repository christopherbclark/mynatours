const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Need to create a transporter that (the service that will actually send the email itself)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    //For Gmail: Activate the "less secure app" option
  });

  //2) Define the email options and
  const mailOptions = {
    from: 'CHRISTOPHER THE GREAT <CTHEGREAT@idrinkbeers.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
