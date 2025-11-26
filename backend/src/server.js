// ✅ Charger les variables d'environnement
require('dotenv').config();

/* 🌐 Debug de configuration */
console.log('=== Variables ENV chargées ===');
console.log('PORT:', process.env.PORT || '5000 (défaut)');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ défini' : '❌ NON défini');
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? '✅ défini' : '❌ NON défini');

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

/* 🔗 Connexion à MongoDB */
connectDB();

/* 📦 Middlewares globaux */
app.use(cors());
// Middleware
app.use(express.json());
/* 📁 Gestion des fichiers statiques (uploads) */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { migrate } = require("../backup");

app.get("/api/backup/:sens", async (req, res) => {
  const { sens } = req.params; // "toLocal" ou "toAtlas"

  if (!["toLocal", "toAtlas"].includes(sens)) {
    return res.status(400).json({ success: false, message: "Paramètre invalide (toLocal/toAtlas)" });
  }

  try {
    await migrate(sens);
    res.json({ success: true, message: `Migration ${sens} terminée` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* 🔀 Définition des routes principales */
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/quizzes', require('./routes/quiz.route'));
app.use('/api/questions', require('./routes/question.route'));
app.use('/api/options', require('./routes/option.route'));
app.use('/api/simulations', require('./routes/simulation.route'));
app.use('/api/dashboard', require('./routes/dasboard.route'));
app.use('/api/classes', require('./routes/classe.route'));
app.use('/api/codes', require('./routes/codeClasse.route'));
app.use('/api/eleves', require('./routes/eleve.route'));
app.use('/api/resultats', require('./routes/resultat.route'));
app.use('/api/contact', require('./routes/contact.route'));

/* 🛑 Gestion 404 */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

/* 💥 Gestion des erreurs globales */
app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne'
  });
});

/* 🚀 Démarrage du serveur */
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`✅ Serveur démarré sur ➜ http://localhost:${PORT}`)
);
