const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
  nom_classe: { type: String, required: true },
  niveau: { type: String, required: true },
  annee_scolaire: { type: String, required: true },
  etablissement: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Classe', classeSchema);