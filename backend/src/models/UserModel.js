const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    nom: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Email invalide']
    },
    telephone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // ajoute automatiquement createdAt et updatedAt
});

// L'identifiant `_id` est automatiquement généré par MongoDB

module.exports = mongoose.model('User', UserSchema);
