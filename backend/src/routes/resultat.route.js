const express = require('express');
const router = express.Router();
const resultatController = require('../controllers/resultat.controller');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate); // protéger toutes les routes

// 📊 Dashboard résultats
router.get('/dashboard', resultatController.getResultatsDashboard);

// CRUD + filtres
router.post('/add', resultatController.ajouterResultat);
router.get('/all', resultatController.listResultats);
router.get('/count', resultatController.countResultats);

// ⚠️ routes spécifiques AVANT la route générique
router.get('/eleve/:eleveId', resultatController.getResultatsByEleve);
router.get('/classe/:classeId', resultatController.listResultatsParClasse);
router.get('/quiz/:quizId', resultatController.getResultatsByQuiz);

// ensuite seulement la route générique par ID
router.get('/:id', resultatController.getResultatById);

router.put('/update/:id', resultatController.updateResultat);
router.delete('/delete/:id', resultatController.deleteResultat);

module.exports = router;
