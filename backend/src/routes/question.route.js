const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

// Ajouter une question
router.post('/add', questionController.addQuestion);

// Lister toutes les questions (avec infos quiz liées)
router.get('/all', questionController.listQuestions);

// (optionnel) Lister les questions par quiz (ex: /quiz/:quizId)
router.get('/quiz/:quizId', questionController.listQuestionsByQuiz);

module.exports = router;
