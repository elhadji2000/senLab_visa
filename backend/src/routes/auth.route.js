const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/authMiddleware');
const User = require('../models/UserModel');

// Route de connexion
router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/me', authenticate, async (req, res) => {
  try {
    // 1. Récupération de l'utilisateur
    const user = await User.findById(req.user.id)
      .select('-password -__v')
      .lean();

    // 2. Vérification de l'existence
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // 3. Réponse standardisée
    res.status(200).json({
      success: true,
      user: {
        ...user,
        // Transformations si nécessaire
        fullName: `${user.prenom} ${user.nom}`,
        isAdmin: user.role === 'admin'
      }
    });

  } catch (error) {
    console.error('Erreur /me:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


module.exports = router;