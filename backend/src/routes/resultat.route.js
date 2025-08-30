const express = require('express');
const router = express.Router();
const resultatController = require('../controllers/resultat.controller');
const authenticate = require('../middleware/authMiddleware'); // Si vous protégez les routes

router.use(authenticate); // Toutes les routes nécessitent une authentification

// 📊 Dashboard résultats
router.get('/dashboard', resultatController.getResultatsDashboard);

// CRUD + filtres
router.post('/add', resultatController.ajouterResultat);
router.get('/all', resultatController.listResultats);
router.get('/count', resultatController.countResultats);
router.get('/:id', resultatController.getResultatById);
router.get('/eleve/:eleveId', resultatController.getResultatsByEleve);
router.get('/par-classe/:classeId', resultatController.listResultatsParClasse);
router.get('/quiz/:quizId', resultatController.getResultatsByQuiz);
router.put('/update/:id', resultatController.updateResultat);
router.delete('/delete/:id', resultatController.deleteResultat);

module.exports = router;
