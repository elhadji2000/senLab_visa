const Simulation = require('../models/Simulation.model');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');

// Récupérer toutes les simulations (liste générale)
// simulations.controller.js
exports.getAllSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.find()
      .sort({ createdAt: -1 }); // Tri décroissant : les plus récentes en haut
    res.status(200).json(simulations);
  } catch (error) {
    console.error("Erreur getAllSimulations:", error);
    res.status(500).json({ message: error.message });
  }
};
// simulations.controller.js
exports.getSimulationsByUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    let filter = {};

    // Vérifier le rôle
    if (req.user.role !== "admin") {
      // Pour les non-admins : voir uniquement leurs propres simulations
      filter = { user: req.user._id };
    }

    const simulations = await Simulation.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "prenom nom email");

    return res.status(200).json(simulations);
  } catch (error) {
    console.error("Erreur getSimulationsByUser:", error);
    return res.status(500).json({ message: error.message });
  }
};



// Ajouter une simulation avec extraction du zip
exports.createSimulation = async (req, res) => {
  try {
    const { titre, description, categorie, niveau } = req.body;
    const photoFile = req.files['photo']?.[0];
    const simFile = req.files['simulation']?.[0];

    if (!photoFile || !simFile) {
      return res.status(400).json({ error: 'Fichiers manquants (photo ou simulation)' });
    }

    // Création de la simulation (avec lien vers l'utilisateur connecté)
    const simulation = new Simulation({
      titre,
      description,
      categorie,
      niveau,
      photo: `/uploads/${photoFile.filename}`,
      simulation: simFile.filename,
      user: req.user._id   // 🔥 Ajout de l’ID utilisateur
    });

    await simulation.save();

    // Extraction dans dossier unique
    const extractDir = path.join(__dirname, '..', 'uploads', 'extracted', simulation._id.toString());
    fs.mkdirSync(extractDir, { recursive: true });

    fs.createReadStream(simFile.path)
      .pipe(unzipper.Extract({ path: extractDir }))
      .on('close', async () => {
        const indexPath = findIndexHtml(extractDir);
        if (!indexPath) {
          return res.status(400).json({ error: 'Aucun fichier index.html trouvé dans le zip' });
        }

        // Simulation créée avec succès
        res.status(201).json({
          message: 'Simulation ajoutée et extraite avec succès',
          simulation: {
            ...simulation.toObject(),
            iframeUrl: `/uploads/extracted/${simulation._id}/index.html`
          }
        });
      })
      .on('error', (err) => {
        console.error('Erreur unzip:', err);
        res.status(500).json({ error: 'Erreur pendant l’extraction du fichier zip' });
      });

  } catch (error) {
    console.error('Erreur createSimulation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


// Obtenir une simulation par ID
exports.getSimulationById = async (req, res) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation introuvable' });
    }

    const iframeUrl = `/uploads/extracted/${simulation._id}/index.html`;
    res.status(200).json({ ...simulation.toObject(), iframeUrl });

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
};

// Supprimer une simulation
exports.deleteSimulation = async (req, res) => {
  try {
    const simulation = await Simulation.findByIdAndDelete(req.params.id);
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation non trouvée' });
    }

    // Supprimer les fichiers associés
    const extractPath = path.join(__dirname, '..', 'uploads', 'extracted', simulation._id.toString());
    const zipPath = path.join(__dirname, '..', 'uploads', simulation.simulation);
    const photoPath = path.join(__dirname, '..', 'uploads', path.basename(simulation.photo));

    [extractPath, zipPath, photoPath].forEach(p => {
      if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
      }
    });

    res.status(200).json({ message: 'Simulation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

//Méthode : Compter les simulations par catégorie
exports.countByCategory = async (req, res) => {
  try {
    const counts = await Simulation.aggregate([
      {
        $group: {
          _id: "$categorie",       // Groupe par catégorie
          count: { $sum: 1 }       // Compte les simulations dans chaque groupe
        }
      },
      {
        $project: {
          _id: 0,
          categorie: "$_id",       // Renomme _id en categorie
          count: 1
        }
      },
      {
        $sort: { categorie: 1 }    // (Facultatif) Trie par nom de catégorie
      }
    ]);

    res.status(200).json(counts);  // Envoie un tableau [{categorie: '...', count: N}, ...]
  } catch (error) {
    console.error('Erreur lors du comptage par catégorie :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Fonction utilitaire : trouver le chemin de index.html
function findIndexHtml(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isFile() && item.name.toLowerCase() === 'index.html') {
      return fullPath;
    }
    if (item.isDirectory()) {
      const nested = findIndexHtml(fullPath);
      if (nested) return nested;
    }
  }
  return null;
}
