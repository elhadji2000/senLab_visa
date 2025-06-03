const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  telephone: { type: String, unique: true, sparse: true }, // sparse pour permettre null
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['admin', 'responsable', 'enseignant', 'etudiant'],
    default: 'etudiant'
  },
  // Dans le schéma User
  status: {
    type: Boolean,
    default: true,
    get: v => !!v // S'assure que la valeur est un booléen
  } // true = actif, false = désactivé
}, { timestamps: true });

/**
 * 🔐 Middleware : hash du mot de passe si modifié
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * 🔐 Comparaison de mot de passe
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
