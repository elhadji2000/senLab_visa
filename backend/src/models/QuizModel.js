const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  niveau: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
