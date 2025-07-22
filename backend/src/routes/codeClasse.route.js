const express = require('express');
const router = express.Router();
const codeClasseController = require('../controllers/codeClasse.controller');
const authenticate = require('../middleware/authMiddleware');

// Toutes les routes protégées par token
router.use(authenticate);

// 🔁 Routes spécifiques AVANT les routes dynamiques
router.post('/add', codeClasseController.ajouterCodeClasse);
router.get('/all', codeClasseController.listCodeClasses);

// 💡 Route pour envoyer les mails — utiliser /send-code/:classeId
router.post('/send-code/:codeClasseId', codeClasseController.sendCodeToStudents);

// ✅ Route spécifique pour une classe (classeId)
router.get("/classe/:classeId", codeClasseController.getCodesByClasse);

// ⚠️ Route dynamique : À placer EN DERNIER
router.get('/:id', codeClasseController.getCodeClasseById);
router.put('/update/:id', codeClasseController.updateCodeClasse);
router.delete('/delete/:id', codeClasseController.deleteCodeClasse);

module.exports = router;
