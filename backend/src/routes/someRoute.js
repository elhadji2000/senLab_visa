// routes/someRoute.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

// Exemple : accessible uniquement aux admins
router.get('/admin-data', auth, checkRole('admin'), (req, res) => {
  res.send('Contenu réservé aux administrateurs');
});

// Exemple : accessible aux admins ou responsables
router.get('/stats', auth, checkRole(['admin', 'responsable']), (req, res) => {
  res.send('Statistiques visibles');
});

module.exports = router;
