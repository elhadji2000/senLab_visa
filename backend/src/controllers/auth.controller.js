const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

// =====================
// Connexion
// =====================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Erreur de configuration du serveur'
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
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

    const payload = {
      userId: user._id,
      role: user.role
    };

    const expiresIn = process.env.TOKEN_EXPIRATION || '1h';

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      user: userWithoutPassword,
      expiresIn
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// =====================
// Inscription
// =====================
exports.register = async (req, res) => {
  try {
    const { prenom, nom, email, password, telephone, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    const user = new User({
      prenom,
      nom,
      email,
      password,
      telephone,
      role: role || 'user' // rôle par défaut
    });

    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur inscription:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email ou téléphone déjà utilisé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

// =====================
// Récupérer les infos de l'utilisateur connecté
// =====================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -__v').lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        fullName: `${user.prenom} ${user.nom}`,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (error) {
    console.error('Erreur getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

