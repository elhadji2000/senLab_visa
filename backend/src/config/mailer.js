const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();

// Transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Config Handlebars
const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    partialsDir: path.resolve("./src/config/mail/templates/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./src/config/mail/templates/"),
  extName: ".hbs",
};

// Utilisation
transporter.use("compile", hbs(handlebarOptions));

module.exports = transporter;
