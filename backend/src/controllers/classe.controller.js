const Classe = require("../models/Classe.model");


exports.ajouterClasse = async (req, res) => {
  try {
    const { nom_classe, niveau, annee_scolaire } = req.body;

    const classe = new Classe({
      nom_classe,
      niveau,
      annee_scolaire,
      user: req.user._id  // 🔥 Lien avec l'utilisateur connecté
    });

    const savedClasse = await classe.save();

    res.status(201).json({
      success: true,
      message: "Classe créée avec succès",
      classe: savedClasse
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.listClasses = async (req, res) => {
  try {
    let classes;

    if (req.user.role === 'admin') {
      // L'admin peut tout voir
      classes = await Classe.find().populate("user", "nom email");
    } else {
      // Les autres utilisateurs ne voient que leurs classes
      classes = await Classe.find({ user: req.user._id });
    }

    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateClasse = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_classe, niveau, annee_scolaire } = req.body;

    const classe = await Classe.findById(id);
    if (!classe) return res.status(404).json({ message: "Classe non trouvée" });

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (req.user.role !== 'admin' && classe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    classe.nom_classe = nom_classe || classe.nom_classe;
    classe.niveau = niveau || classe.niveau;
    classe.annee_scolaire = annee_scolaire || classe.annee_scolaire;

    const updated = await classe.save();
    res.json({ message: "Classe mise à jour avec succès", classe: updated });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteClasse = async (req, res) => {
  try {
    const { id } = req.params;

    const classe = await Classe.findById(id);
    if (!classe) return res.status(404).json({ message: "Classe non trouvée" });

    if (req.user.role !== 'admin' && classe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await Classe.findByIdAndDelete(id);
    res.json({ message: "Classe supprimée avec succès" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.countClasses = async (req, res) => {
  try {
    let count;

    if (req.user.role === 'admin') {
      count = await Classe.countDocuments();
    } else {
      count = await Classe.countDocuments({ user: req.user._id });
    }

    res.json({ total_classes: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

