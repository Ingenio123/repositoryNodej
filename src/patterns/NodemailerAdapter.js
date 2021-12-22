const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "smt.gmail.com",
  port: 465,
  secure: true, // tru for port 465  false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

transporter.verify().then((res) => console.log("Ready for send emails"));

module.exports = {
  transporter,
};
