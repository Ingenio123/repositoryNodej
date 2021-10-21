const nodemailer = require("nodemailer");
const nodemailertransport = require("nodemailer-sendgrid");
const createTrans = () => {
  const transporter = nodemailer.createTransport({
    host: "mail.ingenioonline.com",
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: "calendar@ingenioonline.com",
      pass: "PasswordCal@ingenio#36987",
    },
    tls: {
      rejectUnauthorized: false, // Important for sendimg mail from localhost
    },
  });
  return transporter;
};

// const sgMail = require("@sendgrid/mail");
const sendMail = async () => {
  const transport = createTrans();
  const res = await transport.sendMail({
    from: " 'Luis' <calendar@ingenioonline.com>",
    to: [
      "fernando26298@gmail.com",
      "jlzyjose@gmail.com",
      "support@ingenioonline.com",
    ],
    subject: "Correo Prueba",
    text: "Esto es un email",
  });
  console.log(res);
};

exports.sendMail = () => sendMail();
