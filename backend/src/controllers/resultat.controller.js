const Resultat = require("../models/Resultat.model");

// ➕ Ajouter un résultat
exports.ajouterResultat = async (req, res) => {
  try {
    const { score, note, quiz, eleve } = req.body;

    const nouveauResultat = new Resultat({ score, note, quiz, eleve });
    const saved = await nouveauResultat.save();

    res.status(201).json({ message: "Résultat enregistré", resultat: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 Lister tous les résultats
exports.listResultats = async (req, res) => {
  try {
    const resultats = await Resultat.find()
      .populate("quiz", "titre")
      .populate("eleve", "nom prenom email");
    res.json(resultats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Obtenir un résultat par ID
exports.getResultatById = async (req, res) => {
  try {
    const resultat = await Resultat.findById(req.params.id)
      .populate("quiz")
      .populate("eleve");

    if (!resultat) return res.status(404).json({ message: "Résultat non trouvé" });
    res.json(resultat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🎯 Résultats d’un élève spécifique
exports.getResultatsByEleve = async (req, res) => {
  try {
    const resultats = await Resultat.find({ eleve: req.params.eleveId })
      .populate("quiz", "titre")
      .populate("eleve", "nom prenom");
    res.json(resultats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Résultats d’un quiz spécifique
exports.getResultatsByQuiz = async (req, res) => {
  try {
    const resultats = await Resultat.find({ quiz: req.params.quizId })
      .populate("quiz", "titre")
      .populate("eleve", "nom prenom");
    res.json(resultats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Modifier un résultat
exports.updateResultat = async (req, res) => {
  try {
    const updated = await Resultat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Résultat introuvable" });
    res.json({ message: "Résultat mis à jour", resultat: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Supprimer un résultat
exports.deleteResultat = async (req, res) => {
  try {
    const deleted = await Resultat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Résultat non trouvé" });
    res.json({ message: "Résultat supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔢 Nombre total de résultats
exports.countResultats = async (req, res) => {
  try {
    const count = await Resultat.countDocuments();
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
