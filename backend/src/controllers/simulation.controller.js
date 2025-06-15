const Simulation = require('../models/Simulation.model');
const fs = require('fs');
const path = require('path');

// Créer une simulation
exports.createSimulation = async (req, res) => {
  try {
    // Vérification des fichiers
    if (!req.files) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const { titre, description, categorie, niveau } = req.body;
    const photo = req.files['photo']?.[0];
    const simulation = req.files['simulation']?.[0];

    if (!photo || !simulation) {
      return res.status(400).json({ error: 'Photo et simulation sont requises' });
    }

    // Chemins relatifs pour la base de données
    const photoPath = `/uploads/${photo.filename}`;
    const simulationPath = `/uploads/${simulation.filename}`;

    const newSimulation = new Simulation({
      titre,
      description,
      categorie,
      niveau,
      photo: photoPath,
      simulation: simulationPath
    });

    await newSimulation.save();

    res.status(201).json({
      message: 'Simulation créée avec succès',
      data: {
        ...newSimulation.toObject(),
        // URLs complètes pour le frontend
        photoUrl: `${req.protocol}://${req.get('host')}${photoPath}`,
        simulationUrl: `${req.protocol}://${req.get('host')}${simulationPath}`
      }
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Nettoyage des fichiers en cas d'erreur
    if (req.files) {
      Object.values(req.files).forEach(files => {
        files.forEach(file => {
          fs.unlink(file.path, err => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      });
    }

    res.status(500).json({ 
      error: 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Récupérer toutes les simulations
exports.getAllSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.find().sort({ createdAt: -1 });
    res.status(200).json(simulations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Autres méthodes (getById, update, delete) peuvent être ajoutées ici...