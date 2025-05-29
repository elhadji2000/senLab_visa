const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    telephone: { type: String },
    password: { type: String, required: true, select: false }, // Ne sera pas retourné par défaut
    role: { type: String },
    status: { type: String, default: 'true' },
    image: { type: String },
}, { timestamps: true });

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
