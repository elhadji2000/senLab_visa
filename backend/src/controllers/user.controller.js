const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

// Debug
console.log('[Auth] ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'OK' : 'NON DÉFINI');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/UserModel');

// Version adaptée de register avec gestion d'image
exports.addUser = async (req, res) => {
  try {
    const { prenom, nom, email, password, telephone, role } = req.body;

    // Validation simple
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Création de l'utilisateur
    const user = new User({
      prenom,
      nom,
      email,
      password, // Le middleware pre('save') va le hasher automatiquement
      telephone,
      role
    });

    await user.save();

    // Retourne l'utilisateur sans le mot de passe
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    
    // Gestion des erreurs MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Cet email ou téléphone est déjà utilisé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

// ✅ Liste des utilisateurs (sans mots de passe)
exports.listerUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclure le champ password
        res.json(users);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};