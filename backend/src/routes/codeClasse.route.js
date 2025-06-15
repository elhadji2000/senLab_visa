const express = require('express');
const router = express.Router();
const codeClasseController = require("../controllers/codeClasse.controller");

//ajouter une classe
router.post("/add", codeClasseController.ajouterCode);
// lister tous les classes
router.get("/all", codeClasseController.listCodeClasses);

module.exports = router;