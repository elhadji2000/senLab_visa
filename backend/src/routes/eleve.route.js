const express = require('express');
const router = express.Router();
const eleveController = require('../controllers/eleve.controller');
const authenticate = require('../middleware/authMiddleware');

// Multer pour upload Excel
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Ajouter un élève
router.post('/add', eleveController.addEleve);
router.post("/add-multiple", eleveController.addMultipleEleves);

// Route pour importer Excel
router.post(
  "/import-excel",
  upload.single("file"),                  // middleware multer
  eleveController.importElevesFromExcel   // nouvelle fonction dans le controller
);

// Lister les élèves (admin voit tout, les autres voient leurs propres classes)
router.get('/all', eleveController.listEleves);

// Récupérer les élèves d'une classe spécifique
router.get('/classe/:id', eleveController.getElevesByClasse);
router.get('/count-by-classe', eleveController.countElevesParClasse);

// Dashboard utilisateur (infos globales)
router.get("/dashboard", eleveController.getUserDashboard);

// Mettre à jour un élève par ID
router.put('/update/:id', eleveController.updateEleve);

// Supprimer un élève par ID
router.delete('/delete/:id', eleveController.deleteEleve);

module.exports = router;
