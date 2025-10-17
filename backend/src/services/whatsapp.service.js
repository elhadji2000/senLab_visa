// services/whatsapp.service.js
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Client WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(), // garde la session
});

client.on("qr", (qr) => {
  console.log("📲 QR Code reçu, scanne avec ton téléphone WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp connecté !");
});

client.initialize();

// Fonction d’envoi
async function sendWhatsAppToStudents(students, code, lienTP) {
  const frontUrl = process.env.FRONT_BASE_URL || "http://localhost:3000";

  await Promise.all(
    students.map(async (s) => {
      if (!s.telephone) {
        console.log(`⚠️ Pas de numéro pour ${s.prenom}`);
        return null;
      }

      // Nettoyage du numéro
      let number = s.telephone.replace(/\D/g, ""); // garder que les chiffres

      // Cas 1 : commence par 0 → enlever et mettre 221
      if (number.startsWith("0")) {
        number = "221" + number.slice(1);
      }
      // Cas 2 : pas déjà en 221 → on ajoute 221
      else if (!number.startsWith("221")) {
        number = "221" + number;
      }

      const chatId = `${number}@c.us`;

      try {
        await client.sendMessage(
          chatId,
          `Bonjour ${s.prenom},\nVoici votre code d’accès à la classe\n code : ${code}\nLien: ${frontUrl}/quizz/access/${code} \nlien TP : ${lienTP}`
        );
        console.log(`✅ Message envoyé à ${s.prenom} (${chatId})`);
      } catch (err) {
        console.error(`❌ Erreur envoi WhatsApp à ${s.prenom} (${chatId}) :`, err.message);
      }
    })
  );

  return { sent: students.length, total: students.length };
}

module.exports = { sendWhatsAppToStudents };
