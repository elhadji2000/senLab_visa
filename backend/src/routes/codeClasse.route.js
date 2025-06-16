const express = require('express');
const router = express.Router();
const codeClasseController = require('../controllers/codeClasse.controller');
const authenticate = require('../middleware/authMiddleware');

// Toutes les routes protégées par token
router.use(authenticate);

router.post('/add', codeClasseController.ajouterCodeClasse);
router.get('/all', codeClasseController.listCodeClasses);
router.get('/:id', codeClasseController.getCodeClasseById);
router.put('/update/:id', codeClasseController.updateCodeClasse);
router.delete('/delete/:id', codeClasseController.deleteCodeClasse);

module.exports = router;
