const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true, trim: true },
  nom: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, 'Email invalide']
  },
  telephone: {
    type: String,
    unique: true,
    sparse: true, // autorise null, sinon unique provoque une erreur
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // pour ne pas renvoyer le mot de passe dans les requêtes
  },
  role: {
    type: String,
    enum: ['admin', 'responsable', 'enseignant', 'etudiant'],
    default: 'etudiant'
  },
  status: {
    type: Boolean,
    default: true,
    get: v => !!v // transforme null ou undefined en false
  }
}, {
  timestamps: true,
  toJSON: { getters: true }, // pour que `status` soit bien transformé
  toObject: { getters: true }
});


// 🔐 Middleware : hash du mot de passe si modifié
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

// 🔐 Méthode pour comparer un mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
