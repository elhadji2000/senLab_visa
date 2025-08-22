const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/authMiddleware');

// ✅ Authentification
router.post('/login', authController.login);
router.post('/register', authController.register);

// ✅ Récupérer les infos de l'utilisateur connecté
router.get('/me', authenticate, authController.getMe);
// ✅ Vérifier le token
router.get('/verify', authController.verify);


module.exports = router;
