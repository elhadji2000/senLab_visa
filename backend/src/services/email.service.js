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

async function sendMail(name, email, message) {

  await transporter.sendMail({
    from:email,
    to: process.env.SMTP_FROM,
    subject: `Nouveau message de ${name}`,
    text: message,
    html: `<p><strong>Nom:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong><br/>${message}</p>`,
  });
};

module.exports = { sendClassCodeToStudents, sendMail };
