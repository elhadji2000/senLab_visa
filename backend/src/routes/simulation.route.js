const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authenticate = require('../middleware/authMiddleware');
const simulationController = require('../controllers/simulation.controller');

// Dossier d'upload principal
const uploadDir = path.join(__dirname, '..', 'uploads');

// Multer : stockage des fichiers photo + zip
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ========== PROTECTED ROUTES (auth required) ========== */

// Ajouter une simulation (photo + zip)
router.post(
  '/add',
  authenticate,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'simulation', maxCount: 1 },
  ]),
  simulationController.createSimulation
);

// Récupérer toutes les simulations
router.get('/', simulationController.getAllSimulations);

// Route privée — simulations de l'utilisateur connecté (ou tout si admin)
router.get('/byuser', authenticate, simulationController.getSimulationsByUser);

// Statistiques par catégorie
router.get('/count', simulationController.countByCategory);

// Récupérer une simulation par ID (⚠️ doit être après /count et /byuser)
router.get('/:id', simulationController.getSimulationById);

// ➕ Modifier une simulation (PUT)
router.put(
  '/:id',
  authenticate,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'simulation', maxCount: 1 },
  ]),
  simulationController.updateSimulation
);

// Supprimer une simulation
router.delete('/:id', authenticate, simulationController.deleteSimulation);

// Servir le fichier HTML extrait d'une simulation
router.get('/html/:simulationId', (req, res) => {
  const buildDir = path.join(__dirname, '..', 'uploads', 'extracted', req.params.simulationId);

  const htmlFile = fs.readdirSync(buildDir).find(file => file.toLowerCase().endsWith('.html'));

  if (!htmlFile) {
    return res.status(404).send('Fichier HTML introuvable');
  }

  const htmlPath = path.join(buildDir, htmlFile);
  res.sendFile(htmlPath);
});


module.exports = router;
