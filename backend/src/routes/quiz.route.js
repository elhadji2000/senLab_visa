const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const authenticate = require('../middleware/authMiddleware'); // middleware d'authentification

// ✅ Toutes les routes sont protégées par authentification
router.use(authenticate);

// ➕ Ajouter un nouveau quiz (avec questions et options)
router.post('/add', quizController.addQuiz);

// 📋 Lister tous les quiz (admin = tous, sinon = ceux du user)
router.get('/all', quizController.listQuizzes);

// 🔢 Obtenir le nombre de quiz (admin = tous, sinon = user)
router.get('/count', quizController.countQuizzes);

// 🔍 Obtenir un quiz + questions + options
router.get('/:id', quizController.getQuizWithQuestionsAndOptions);

// ✏️ Modifier un quiz (titre, desc, niveau)
router.put('/:id', quizController.updateQuiz);

// ❌ Supprimer un quiz et ses dépendances
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;
