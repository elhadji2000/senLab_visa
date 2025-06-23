const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

// ✅ Ajouter un utilisateur
exports.addUser = async (req, res) => {
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
      role
    });

    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Cet email ou téléphone est déjà utilisé'
      });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ✅ Lister tous les utilisateurs
exports.listerUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { prenom, nom, email, password, telephone, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Mise à jour des champs
    user.prenom = prenom || user.prenom;
    user.nom = nom || user.nom;
    user.email = email || user.email;
    user.telephone = telephone || user.telephone;
    user.role = role || user.role;

    if (password) {
      user.password = password; // sera hashé par le middleware pre('save')
    }

    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Erreur de mise à jour:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
