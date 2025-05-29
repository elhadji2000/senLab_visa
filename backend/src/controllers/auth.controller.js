// src/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Vérification de l'existence de l'utilisateur
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentification échouée' 
      });
    }

    // 2. Vérification que le mot de passe existe
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Méthode d\'authentification invalide'
      });
    }

    // 3. Comparaison des mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentification échouée' 
      });
    }

    // 4. Création du token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // 5. Réponse sans le mot de passe
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword,
      expiresIn: 3600 // 1 heure en secondes
    });

  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};