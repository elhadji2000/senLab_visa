// services/email.service.js
const transporter = require("../config/mailer");

async function sendClassCodeToStudents(students, code, lienTP) {
  const frontUrl = process.env.FRONT_BASE_URL || "http://localhost:3000";

  await Promise.all(
    students.map((s) =>
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: s.email,
        subject: "Votre code d’accès à la classe",
        template: "classCode",
        context: { prenom: s.prenom, code, lienTP, frontUrl },
      }),
    ),
  );

  return { sent: students.length, total: students.length };
}

module.exports = { sendClassCodeToStudents };
