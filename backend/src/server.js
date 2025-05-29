const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
require('dotenv').config();

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
