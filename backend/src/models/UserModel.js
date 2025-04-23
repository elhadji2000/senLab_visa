const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true}, // true = Admin
  status: { type: String, default: 'true' },
  image: { type: String }, // chemin de l’image
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
