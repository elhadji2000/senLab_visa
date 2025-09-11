const Resultat = require("../models/Resultat.model");
const Quiz = require("../models/Quiz.model");
const Classe = require("../models/Classe.model");
const Eleve = require("../models/Eleve.model");
const mongoose = require("mongoose");

exports.getResultatsDashboard = async (req, res) => {
  try {
    // id du User connecté (prof/admin)
    const userId = req.user._id;

    // 1️⃣ Récupérer toutes les classes de ce user
    const classes = await Classe.find({ user: userId }).select('_id');
    const classeIds = classes.map((c) => c._id);

    // 2️⃣ Récupérer les élèves de ces classes
    const eleves = await Eleve.find({ classe: { $in: classeIds } }).select('_id');
    const eleveIds = eleves.map((e) => e._id);

    // 3️⃣ Récupérer tous les résultats des élèves
    const resultats = await Resultat.find({ eleve: { $in: eleveIds } })
      .populate({
        path: 'eleve',
        select: 'nom prenom classe',
        populate: { path: 'classe', select: 'nom_classe' },
      })
      .populate('quiz', 'titre');

    if (resultats.length === 0) {
      return res.json({
        success: true,
        tauxReussite: 0,
        evaluations: [],
      });
    }

    // 4️⃣ Calcul taux de réussite global
    let totalPourcentages = 0;
    let countValides = 0;

    resultats.forEach((r) => {
      if (r.note) {
        // "2 / 2" → [2,2]
        const [numerateur, denominateur] = r.note
          .split('/')
          .map((x) => parseFloat(x.trim()));
        if (denominateur > 0) {
          const pourcentage = (numerateur / denominateur) * 100;
          totalPourcentages += pourcentage;
          countValides++;
        }
      }
    });

    const tauxReussite =
      countValides > 0 ? parseFloat((totalPourcentages / countValides).toFixed(2)) : 0;

    // 5️⃣ Calcul par quiz
    const evaluationsMap = {};

    resultats.forEach((r) => {
      if (!r.quiz?._id) return;

      const quizId = r.quiz._id.toString();
      if (!evaluationsMap[quizId]) {
        evaluationsMap[quizId] = {
          id: quizId,
          title: r.quiz.titre,
          class: r.eleve?.classe?.nom_classe || 'N/A',
          submissions: 0,
          totalPourcentages: 0,
          countNotes: 0,
        };
      }

      evaluationsMap[quizId].submissions++;
      if (r.note) {
        const [num, den] = r.note
          .split('/')
          .map((x) => parseFloat(x.trim()));
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
          ? parseFloat((e.totalPourcentages / e.countNotes).toFixed(2))
          : null,
    }));

    // 6️⃣ Réponse
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

  // Validation rapide de l'ID
  if (!mongoose.Types.ObjectId.isValid(classeId)) {
    return res.status(400).json({ error: "classeId invalide" });
  }

  try {
    // 1) Récupérer les élèves de la classe (on ne récupère que leurs _id)
    const eleves = await Eleve.find({ classe: classeId }).select("_id").lean();
    if (!eleves || eleves.length === 0) {
      return res.json([]); // pas d'élèves => pas de résultats
    }
    const eleveIds = eleves.map((e) => e._id);

    // 2) Récupérer les résultats qui correspondent à ces élèves
    const resultats = await Resultat.find({ eleve: { $in: eleveIds } })
      .populate({
        path: "eleve",
        select: "nom prenom email classe",
        populate: { path: "classe", select: "nom" },
      })
      .populate({ path: "quiz", select: "titre categorie" })
      .sort({ createdAt: -1 }) // optionnel : tri par date décroissante
      .lean();

    // 3) Sanitization : s'assurer que quiz/eleve/classe existent et normaliser la note
    const sanitized = resultats.map((r) => {
      // eleve supprimé ?
      if (!r.eleve) {
        r.eleve = { _id: null, nom: "Élève supprimé", prenom: "", email: "", classe: null };
      } else {
        // classe manquante ?
        if (!r.eleve.classe) {
          r.eleve.classe = { _id: null, nom: "N/A" };
        }
      }

      // quiz supprimé ?
      if (!r.quiz) {
        r.quiz = { _id: null, titre: "Quiz supprimé", categorie: null };
      }

      // normaliser la note (ex: "2 / 2" ou "2/2" -> "2 / 2")
      if (typeof r.note === "string") {
        const parts = r.note.split("/").map((p) => (p ? p.trim() : ""));
        r.note = `${parts[0] || ""} / ${parts[1] || ""}`;
      } else {
        // si note absent, garder null ou "N/A"
        r.note = r.note ?? null;
      }

      // s'assurer que score est une string (ou formattée)
      if (r.score != null && typeof r.score !== "string") {
        r.score = String(r.score);
      }

      return r;
    });

    return res.json(sanitized);
  } catch (error) {
    console.error("listResultatsParClasse error:", error);
    return res.status(500).json({ error: error.message });
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
