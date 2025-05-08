const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

// Ajouter une question
router.post('/add', questionController.addQuestion);

// Lister toutes les questions
router.get('/all', questionController.listQuestions);

module.exports = router;
