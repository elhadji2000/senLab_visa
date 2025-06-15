const mongoose = require('mongoose');

const codeClasseSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  matiere: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('codeClasse', codeClasseSchema);