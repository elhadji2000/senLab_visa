const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  niveau: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
