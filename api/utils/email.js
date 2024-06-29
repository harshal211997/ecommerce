const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  //1.Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_POSRT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2.Define mail options
  const mailOptions = {
    from: "Ecommerce <ecommerce@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //send mail
  await transporter.sendMail(mailOptions);
};
module.exports = sendMail;
