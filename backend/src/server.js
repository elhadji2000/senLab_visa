// DOIT ÊTRE LA PREMIÈRE LIGNE du fichier principal
require('dotenv').config({ path: __dirname + '/.env' }); // Chemin absolu

// Debug immédiat
console.log('=== Variables chargées ===');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? '***masqué***' : 'non défini');
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? '***masqué***' : 'NON DÉFINI - ERREUR');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', require('./routes/user.route'));
app.use('/api/quizzes', require('./routes/quiz.route'));
app.use('/api/questions', require('./routes/question.route'));
app.use('/api/options', require('./routes/option.route'));
app.use('/api/simulations', require('./routes/simulation.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/dashboard', require('./routes/dasboard.route'));

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
