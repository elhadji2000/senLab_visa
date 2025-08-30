const Resultat = require("../models/Resultat.model");
const Quiz = require("../models/Quiz.model");
const Classe = require("../models/Classe.model");
const Eleve = require("../models/Eleve.model");

exports.getResultatsDashboard = async (req, res) => {
  try {
    // ⚡ Charger tous les résultats de l'utilisateur connecté
    const resultats = await Resultat.find()
      .populate({
        path: "eleve",
        select: "nom prenom classe",
        populate: { path: "classe", select: "nom_classe" }, // ✅ bien peupler la classe
      })
      .populate("quiz", "titre");

    if (resultats.length === 0) {
      return res.json({
        success: true,
        tauxReussite: 0,
        evaluations: [],
      });
    }

    // ➗ Calcul taux de réussite global
    let totalPourcentages = 0;
    let countValides = 0;

    resultats.forEach((r) => {
      if (r.note) {
        const [numerateur, denominateur] = r.note.split("/").map(Number);
        if (denominateur > 0) {
          const pourcentage = (numerateur / denominateur) * 100;
          totalPourcentages += pourcentage;
          countValides++;
        }
      }
    });

    const tauxReussite =
      countValides > 0 ? (totalPourcentages / countValides).toFixed(2) : 0;

    // 📋 Evaluations récentes (par quiz)
    const evaluationsMap = {};

    resultats.forEach((r) => {
      if (!r.quiz?._id) return;

      const quizId = r.quiz._id.toString();
      if (!evaluationsMap[quizId]) {
        evaluationsMap[quizId] = {
          id: quizId,
          title: r.quiz.titre,
          class: r.eleve?.classe?.nom_classe || "N/A",
          submissions: 0,
          totalPourcentages: 0,
          countNotes: 0,
        };
      }

      evaluationsMap[quizId].submissions++;
      if (r.note) {
        const [num, den] = r.note.split("/").map(Number);
        if (den > 0) {
          evaluationsMap[quizId].totalPourcentages += (num / den) * 100;
          evaluationsMap[quizId].countNotes++;
        }
      }
    });

    const evaluations = Object.values(evaluationsMap).map((e) => ({
      id: e.id,
      title: e.title,
      class: e.class,
      submissions: e.submissions,
      average:
        e.countNotes > 0
          ? (e.totalPourcentages / e.countNotes).toFixed(2)
          : null,
    }));

    res.json({
      success: true,
      tauxReussite,
      evaluations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
      .populate("quiz", "titre categorie")
      .populate("eleve", "nom prenom email");
    res.json(resultats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listResultatsParClasse = async (req, res) => {
  const { classeId } = req.params;

  try {
    const resultats = await Resultat.find()
      .populate({
        path: "eleve",
        select: "nom prenom email classe", // on récupère la classe de l'élève
        populate: {
          path: "classe",
          select: "nom", // optionnel : récupérer aussi le nom de la classe
        },
      })
      .populate("quiz", "titre categorie");

    // Filtrer les résultats appartenant à la classe demandée
    const filtres = resultats.filter(
      (r) => r.eleve?.classe?._id.toString() === classeId
    );

    res.json(filtres);
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

    if (!resultat)
      return res.status(404).json({ message: "Résultat non trouvé" });
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
    const updated = await Resultat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Résultat introuvable" });
    res.json({ message: "Résultat mis à jour", resultat: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Supprimer un résultat
exports.deleteResultat = async (req, res) => {
  try {
    const deleted = await Resultat.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Résultat non trouvé" });
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
