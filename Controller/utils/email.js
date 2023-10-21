const nodemailer = require("nodemailer");

// 1) create Transport

const sendEmail = async (options) => {
  // 1) create Transport

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERS,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2) Create options

  const mailOptions = {
    from: "Sufyan Akram",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send Actuall email

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
