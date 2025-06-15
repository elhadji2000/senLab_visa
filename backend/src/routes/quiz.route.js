const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const authenticate = require('../middleware/authMiddleware'); // middleware d'authentification

// Toutes les routes nécessitent d'être connecté
router.use(authenticate);

// Ajouter un quiz
router.post('/add', quizController.addQuiz);

// Lister tous les quiz (selon rôle dans controller)
router.get('/all', quizController.listQuizzes);

// Obtenir un quiz avec ses questions et options
router.get('/:id', quizController.getQuizWithQuestionsAndOptions);

// Mise à jour d'un quiz
router.put('/:id', quizController.updateQuiz);

// Suppression d'un quiz
router.delete('/:id', quizController.deleteQuiz);

// Compter le nombre de quiz
router.get('/count', quizController.countQuizzes);

module.exports = router;
