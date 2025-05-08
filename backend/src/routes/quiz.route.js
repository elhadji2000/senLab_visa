const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

// Ajouter un quiz
router.post('/add', quizController.addQuiz);

// Lister tous les quiz
router.get('/all', quizController.listQuizzes);

// Obtenir un quiz avec ses questions et options
router.get('/:id', quizController.getQuizWithQuestionsAndOptions);

module.exports = router;
