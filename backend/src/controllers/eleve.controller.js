const Eleve = require('../models/Eleve.model');
const Classe = require('../models/Classe.model'); // Pour vérifier la propriété user

// Récupérer les élèves d'une classe spécifique
exports.getElevesByClasse = async (req, res) => {
  try {
    const classeId = req.params.id;

    // Vérifier que l'utilisateur a accès à cette classe (sauf admin)
    if (req.user.role !== 'admin') {
      const classeExists = await Classe.findOne({ _id: classeId, user: req.user.id });
      if (!classeExists) {
        return res.status(403).json({ 
          success: false, 
          message: "Vous n'avez pas accès à cette classe" 
        });
      }
    }

    // Récupérer les élèves de la classe
    const eleves = await Eleve.find({ classe: classeId })
      .select('nom prenom email date_naissance')
      .sort({ nom: 1 });

    res.json({ success: true, eleves });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ... (autres méthodes existantes)
// Ajouter un élève
exports.addEleve = async (req, res) => {
  try {
    const { nom, prenom, email, date_naissance, classe } = req.body;

    // Vérifier que la classe appartient à l'utilisateur (sauf admin)
    if (req.user.role !== 'admin') {
      const classeExists = await Classe.findOne({ _id: classe, user: req.user.id });
      if (!classeExists) {
        return res.status(403).json({ success: false, message: "Vous ne pouvez pas ajouter un élève dans cette classe" });
      }
    }

    const eleve = new Eleve({ nom, prenom, email, date_naissance, classe });
    const savedEleve = await eleve.save();
    res.status(201).json({ success: true, eleve: savedEleve });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Lister les élèves visibles par l'utilisateur
exports.listEleves = async (req, res) => {
  try {
    let eleves;

    if (req.user.role === 'admin') {
      // Admin voit tout
      eleves = await Eleve.find().populate('classe');
    } else {
      // L’utilisateur voit les élèves de ses classes seulement
      // Trouver les classes de l'utilisateur
      const classesUser = await Classe.find({ user: req.user.id }).select('_id');

      const classesIds = classesUser.map(c => c._id);

      eleves = await Eleve.find({ classe: { $in: classesIds } }).populate('classe');
    }

    res.json({ success: true, eleves });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Compter le nombre d'élèves visibles par l'utilisateur
exports.countEleves = async (req, res) => {
  try {
    let count;

    if (req.user.role === 'admin') {
      count = await Eleve.countDocuments();
    } else {
      const classesUser = await Classe.find({ user: req.user.id }).select('_id');
      const classesIds = classesUser.map(c => c._id);
      count = await Eleve.countDocuments({ classe: { $in: classesIds } });
    }

    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Modifier un élève
exports.updateEleve = async (req, res) => {
  try {
    const eleveId = req.params.id;
    const updates = req.body;

    // Récupérer l'élève
    const eleve = await Eleve.findById(eleveId);
    if (!eleve) return res.status(404).json({ success: false, message: "Élève non trouvé" });

    // Vérifier les droits si pas admin
    if (req.user.role !== 'admin') {
      const classeExists = await Classe.findOne({ _id: eleve.classe, user: req.user.id });
      if (!classeExists) {
        return res.status(403).json({ success: false, message: "Vous n'êtes pas autorisé à modifier cet élève" });
      }
    }

    // Si la classe est modifiée dans updates, vérifier que l'utilisateur a accès à cette classe
    if (updates.classe && req.user.role !== 'admin') {
      const classeExists = await Classe.findOne({ _id: updates.classe, user: req.user.id });
      if (!classeExists) {
        return res.status(403).json({ success: false, message: "Vous ne pouvez pas déplacer cet élève vers cette classe" });
      }
    }

    // Mise à jour
    const updatedEleve = await Eleve.findByIdAndUpdate(eleveId, updates, { new: true });
    res.json({ success: true, eleve: updatedEleve });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Supprimer un élève
exports.deleteEleve = async (req, res) => {
  try {
    const eleveId = req.params.id;

    // Récupérer l'élève
    const eleve = await Eleve.findById(eleveId);
    if (!eleve) return res.status(404).json({ success: false, message: "Élève non trouvé" });

    // Vérifier les droits si pas admin
    if (req.user.role !== 'admin') {
      const classeExists = await Classe.findOne({ _id: eleve.classe, user: req.user.id });
      if (!classeExists) {
        return res.status(403).json({ success: false, message: "Vous n'êtes pas autorisé à supprimer cet élève" });
      }
    }

    // Suppression
    await Eleve.findByIdAndDelete(eleveId);
    res.json({ success: true, message: "Élève supprimé avec succès" });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Obtenir le nombre d'élèves par classe (groupé)
exports.countElevesParClasse = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== 'admin') {
      const classesUser = await Classe.find({ user: req.user.id }).select('_id');
      const classesIds = classesUser.map(c => c._id);
      filter.classe = { $in: classesIds };
    }

    // Agrégation MongoDB : group by classe + count
    const result = await Eleve.aggregate([
      { $match: filter },
      { $group: { _id: "$classe", count: { $sum: 1 } } }
    ]);

    // Format : { classeId: count }
    const counts = {};
    result.forEach(item => {
      counts[item._id.toString()] = item.count;
    });

    res.json({ success: true, counts });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
