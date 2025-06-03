// src/controllers/auth.controller.js
// En tout premier ligne du fichier
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

// Debug
console.log('[Auth] ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'OK' : 'NON DÉFINI');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const fsPromise = require('fs').promises;

exports.login = async (req, res) => {
  const { email, password } = req.body;

 /*  / Debug: Vérifiez que le secret est bien chargé */
  console.log('JWT Secret:', process.env.ACCESS_TOKEN_SECRET);
  
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error('ERROR: ACCESS_TOKEN_SECRET is not defined!');
    return res.status(500).json({
      success: false,
      message: 'Configuration serveur invalide'
    });
  }

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email et mot de passe requis'
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Identifiants incorrects' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Identifiants incorrects' 
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      token: 'Bearer ' + token, // Préfixe recommandé
      user: userWithoutPassword,
      expiresIn: 3600
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};

exports.register = async (req, res) => {
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

// src/controllers/auth.controller.js
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};