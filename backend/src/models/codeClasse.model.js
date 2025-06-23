const mongoose = require('mongoose');

const codeClasseSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  date_debut: { type: String, required: true },
  expiration: { type: String, required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  simulation: { type: mongoose.Schema.Types.ObjectId, ref: 'Simulation' },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('CodeClasse', codeClasseSchema);
