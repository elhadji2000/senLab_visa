const Eleve = require('../models/Eleve.model');
const Classe = require('../models/Classe.model');
const CodeClasse = require('../models/codeClasse.model');
const User = require("../models/User.model"); // adapte le chemin
const Quiz = require("../models/Quiz.model");
const Simulation = require("../models/Simulation.model");


// Récupérer les élèves d'une classe spécifique
const mongoose = require('mongoose');

const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

// Configuration multer pour upload temporaire
const upload = multer({ dest: "uploads/" });

// Middleware pour utiliser dans la route
exports.uploadExcel = upload.single("file");

// Importer des élèves depuis un fichier Excel
exports.importElevesFromExcel = async (req, res) => {
  try {
    const file = req.file;
    const { classId } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: "Fichier Excel manquant." });
    }

    if (!classId) {
      return res.status(400).json({ success: false, message: "ID de classe requis." });
    }

    // Vérifier si la classe existe
    const classe = await Classe.findById(classId);
    if (!classe) {
      return res.status(404).json({ success: false, message: "Classe introuvable." });
    }

    // Lire le fichier Excel
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ success: false, message: "Fichier Excel vide." });
    }

    // Mapper les données Excel au modèle Eleve
    const elevesToInsert = data.map((row) => ({
      nom: row.Nom || row.nom,
      prenom: row.Prénom || row.prenom,
      email: row.Email || row.email || "",
      telephone: row.telephone || row.Téléphone ||row.téléphone || "",
      date_naissance: row.DateNaissance ? new Date(row.DateNaissance) : new Date(),
      classe: classId,
    }));

    // Vérifier si l'utilisateur a le droit d'ajouter dans cette classe
    if (req.user.role !== "admin" && String(classe.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Vous n'avez pas l'autorisation d'ajouter des élèves dans cette classe." });
    }

    // Insérer dans MongoDB
    const insertedEleves = await Eleve.insertMany(elevesToInsert);

    // Supprimer le fichier temporaire
    fs.unlinkSync(file.path);

    res.status(201).json({
      success: true,
      message: `${insertedEleves.length} élèves importés avec succès.`,
      eleves: insertedEleves,
    });
  } catch (error) {
    console.error("Erreur importElevesFromExcel:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getElevesByClasse = async (req, res) => {
  try {
    const classeId = req.params.id;

    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(classeId)) {
      return res.status(400).json({ success: false, message: "ID de classe invalide." });
    }

    // Vérifier que la classe existe et appartient bien à l'utilisateur connecté (si non admin)
    const classe = await Classe.findById(classeId);

    if (!classe) {
      return res.status(404).json({
        success: false,
        message: "Classe introuvable."
      });
    }

    // Si l'utilisateur n'est pas admin, il doit être le créateur de la classe
    if (req.user.role !== 'admin' && String(classe.user) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation d'accéder à cette classe."
      });
    }

    // Récupération des élèves de cette classe
    const eleves = await Eleve.find({ classe: classeId })
      .select('nom prenom email date_naissance telephone')
      .sort({ nom: 1 },{ prenom: 1 });

    res.json({ success: true, eleves });
  } catch (error) {
    console.error("Erreur getElevesByClasse:", error);
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
    const { nom, prenom, email, telephone, date_naissance, classe } = req.body;

    // Vérifier que la classe appartient à l'utilisateur (sauf admin)
    if (req.user.role !== 'admin') {
      const classeExists = await Classe.findOne({ _id: classe, user: req.user.id });
      if (!classeExists) {
        return res.status(403).json({ success: false, message: "Vous ne pouvez pas ajouter un élève dans cette classe" });
      }
    }

    const eleve = new Eleve({ nom, prenom, email, telephone, date_naissance, classe });
    const savedEleve = await eleve.save();
    res.status(201).json({ success: true, eleve: savedEleve });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.addMultipleEleves = async (req, res) => {
  try {
    const eleves = req.body;

    if (!Array.isArray(eleves) || eleves.length === 0) {
      return res.status(400).json({ success: false, message: "Aucun élève à ajouter." });
    }

    // Extraire tous les IDs de classes uniques
    const classeIds = [...new Set(eleves.map(e => e.classe))];

    // Vérification que chaque ID est valide (évite erreurs MongoDB)
    for (const id of classeIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `ID de classe invalide : ${id}`
        });
      }
    }

    if (req.user.role !== 'admin') {
      // Récupérer les classes créées par l'utilisateur connecté
      const ownedClasses = await Classe.find({
        _id: { $in: classeIds },
        user: req.user._id
      });

      const ownedClassIds = ownedClasses.map(c => c._id.toString());

      const nonAutorisees = classeIds.filter(id => !ownedClassIds.includes(id));
      if (nonAutorisees.length > 0) {
        return res.status(403).json({
          success: false,
          message: `Vous ne pouvez pas ajouter d'élèves dans ces classes : ${nonAutorisees.join(', ')}`
        });
      }
    }

    // Insérer les élèves
    const inserted = await Eleve.insertMany(eleves);
    res.status(201).json({ success: true, eleves: inserted });

  } catch (error) {
    console.error("Erreur lors de l'ajout des élèves :", error);
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

    // Vérifier si l'élève existe et appartient à cet utilisateur
    const eleve = await Eleve.findOne({ _id: eleveId, user: req.user.id });
    if (!eleve) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer cet élève ou il n'existe pas",
      });
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
// Dashboard utilisateur : infos globales
exports.getUserDashboard = async (req, res) => {
  try {
    let eleves, classes, codeClasses, totalQuizzes, totalUsers, totalSimulation;

    if (req.user.role === "admin") {
      // Admin -> toutes les infos
      classes = await Classe.find().select("nom_classe user");
      eleves = await Eleve.find().populate("classe", "nom_classe");
      codeClasses = await CodeClasse.find().populate("classe", "nom_classe");

      // Admin -> tous les quizzes et tous les users
      totalQuizzes = await Quiz.countDocuments();
      totalUsers = await User.countDocuments();
    } else {
      // Récupérer les classes de l'utilisateur connecté
      classes = await Classe.find({ user: req.user._id }).select("nom_classe");

      const classIds = classes.map(c => c._id);

      eleves = await Eleve.find({ classe: { $in: classIds } }).populate("classe", "nom_classe");
      codeClasses = await CodeClasse.find({ classe: { $in: classIds } }).populate("classe", "nom_classe");

      // Quizzes créés par cet utilisateur
      totalQuizzes = await Quiz.countDocuments({ user: req.user._id });
      totalSimulation = await Simulation.countDocuments({ user: req.user._id });

      // Pas logique de donner tous les users à un prof -> on renvoie que lui-même
      totalUsers = 1;
    }

    // Compter le total d'élèves
    const totalEleves = eleves.length;

    // Compter le total de classes
    const totalClasses = classes.length;

    // Compter le total de codesClasse
    const totalCodeClasses = codeClasses.length;

    // Compter les élèves par classe
    const countsByClasse = {};
    eleves.forEach(e => {
      const classeId = e.classe?._id?.toString();
      if (classeId) {
        countsByClasse[classeId] = (countsByClasse[classeId] || 0) + 1;
      }
    });

    res.json({
      success: true,
      user: {
        id: req.user._id,
        nom: req.user.nom,
        prenom: req.user.prenom,
        email: req.user.email,
        role: req.user.role,
      },
      stats: {
        totalEleves,
        totalClasses,
        totalCodeClasses,
        totalSimulation,
        totalQuizzes,  // ✅ ajouté
        totalUsers,    // ✅ ajouté
        elevesParClasse: countsByClasse,
      },
      classes,
      eleves,
      codeClasses,
    });
  } catch (error) {
    console.error("Erreur getUserDashboard:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

