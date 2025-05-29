const mongoose = require('mongoose');

// Modèle QuizResult pour suivre la complétion des quizzes
const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  completed: { type: Boolean, default: false },
  startedAt: { type: Date },
  completedAt: { type: Date },
  // ... autres champs
});

module.exports = mongoose.model('QuizResult', quizResultSchema);