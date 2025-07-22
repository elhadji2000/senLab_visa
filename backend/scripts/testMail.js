const transporter = require("../src/config/mailer");
require("dotenv").config();

console.log("SMTP_HOST =", process.env.SMTP_HOST);


(async () => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: "diopelhadjimadiop@gmail.com",
    subject: "Test code classe",
    template: "classCode",
    context: {
      prenom: "Testeur",
      code: "DEV123",
      frontUrl: "http://localhost:3000",
    },
  });
  console.log("E‑mail test envoyé !");
})();
