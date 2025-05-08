const express = require('express');
const router = express.Router();
const optionController = require('../controllers/option.controller');

// Ajouter une option
router.post('/add', optionController.addOption);

// Lister toutes les options
router.get('/all', optionController.listOptions);

module.exports = router;
