const mongoose = require('mongoose');

const resultatSchema = new mongoose.Schema({
  score: { type: String, required: true },
  note: { type: String, required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Resultat', resultatSchema);