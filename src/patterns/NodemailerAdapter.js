const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465  false for other ports
  auth: {
    user: process.env.GOOGELE_USER,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

transporter.verify().then((res) => {
  console.log("Ready for send emails");
});

module.exports = {
  transporter,
};
