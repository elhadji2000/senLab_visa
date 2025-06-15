const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  date_naissance: { type: String, required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' }
}, { timestamps: true });

module.exports = mongoose.model('Eleve', eleveSchema);
