const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // tru for port 465  false for other ports
  auth: {
    user: "jlzyjose@gmail.com",
    pass: "ywitwhgcdldamjmj",
  },
});

transporter.verify().then((res) => console.log("Ready for send emails"));

module.exports = {
  transporter,
};
