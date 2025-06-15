const express = require('express');
const router = express.Router();
const extract = require('extract-zip');
const simulationController = require('../controllers/simulation.controller');
const path = require('path');
const fs = require('fs');
const Simulation = require('../models/Simulation.model');
const multer = require('multer');

// Chemin relatif sûr
const uploadDir = path.join(__dirname, '..', 'uploads');

// Configuration Multer avec vérification du dossier
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Créer le dossier s'il n'existe pas
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route pour créer une simulation
router.post(
  '/add', 
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'simulation', maxCount: 1 }
  ]), 
  simulationController.createSimulation
);

// Route pour récupérer toutes les simulations
router.get('/', simulationController.getAllSimulations);

// Nouvelle route pour récupérer l'archive d'une simulation
// Route pour récupérer l'archive


// Route pour compter les simulations par catégorie
router.get('/count-by-category', async (req, res) => {
  try {
    const counts = await Simulation.aggregate([
      { $group: { _id: "$categorie", count: { $sum: 1 } } }
    ]);
    
    // Transformer le tableau en objet { Catégorie: count }
    const result = {};
    counts.forEach(item => {
      result[item._id] = item.count;
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajoutez cette route après vos autres routes
router.get('/html/:simulationId', async (req, res) => {
    try {
        const simulationId = req.params.simulationId;
        const extractDir = path.join(__dirname,'..', 'uploads', 'extracted', simulationId);

        // Vérifier si le dossier existe
        if (!fs.existsSync(extractDir)) {
            return res.status(404).json({ error: 'Dossier non trouvé' });
        }

        // Trouver le fichier HTML principal
        const files = fs.readdirSync(extractDir);
        const htmlFile = files.find(file => file.endsWith('.html'));
        
        if (!htmlFile) {
            return res.status(404).json({ error: 'Aucun fichier HTML trouvé' });
        }

        // Lire et envoyer le contenu HTML
        const htmlPath = path.join(extractDir, htmlFile);
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        
        res.set('Content-Type', 'text/html');
        res.send(htmlContent);

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;