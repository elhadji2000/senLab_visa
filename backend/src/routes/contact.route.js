const express = require('express');
const { sendMail } = require("../services/email.service");

const router = express.Router();

router.post("/", async (req, res) => {
  try { 
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    await sendMail(name, email, message);
    res.status(200).json({ message: "Message envoyé avec succès !" });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi." });
  }
});

module.exports = router;
