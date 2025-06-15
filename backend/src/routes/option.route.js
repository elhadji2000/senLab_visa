const express = require('express');
const router = express.Router();
const optionController = require('../controllers/option.controller');

// Ajouter une option
router.post('/add', optionController.addOption);

// Modifier une option par id
router.put('/:id', optionController.updateOption);

// Supprimer une option par id
router.delete('/:id', optionController.deleteOption);

// Lister toutes les options
router.get('/all', optionController.listOptions);

// Lister les options d'une question spécifique
router.get('/question/:questionId', optionController.listOptionsByQuestion);

module.exports = router;
