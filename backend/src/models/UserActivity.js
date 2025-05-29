const mongoose = require('mongoose');

// Modèle UserActivity pour suivre l'activité quotidienne
const userActivitySchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  activeUsers: { type: Number, default: 0 },
  completedQuizzes: { type: Number, default: 0 },
  completedSimulations: { type: Number, default: 0 }
});

// Modèle QuizResult pour suivre la complétion des quizzes
const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  completed: { type: Boolean, default: false },
  startedAt: { type: Date },
  completedAt: { type: Date },
  // ... autres champs
});

module.exports = mongoose.model('UserActivity', userActivitySchema);