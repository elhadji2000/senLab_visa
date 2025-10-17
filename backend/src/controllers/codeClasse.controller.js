const CodeClasse = require("../models/codeClasse.model");
const { sendClassCodeToStudents } = require("../services/email.service");
const { sendWhatsAppToStudents } = require("../services/whatsapp.service");
const Student = require("../models/Eleve.model"); // modèle élève

exports.sendCodeToStudents = async (req, res) => {
  console.log("PARAMS REÇUS :", req.params);
  try {
    const { codeClasseId } = req.params;

    // 1. On récupère le codeClasse ciblé
    const codeDoc = await CodeClasse.findById(codeClasseId).populate("classe");
    if (!codeDoc) {
      return res.status(404).json({ error: "CodeClasse introuvable" });
    }

    if (codeDoc.actif) {
      return res.status(400).json({ error: "Ce code est déjà actif" });
    }

    // 2. Récupération des élèves de la classe liée à ce code
    const students = await Student.find({ classe: codeDoc.classe._id })
      .select("email prenom telephone");
    if (!students.length) {
      return res.status(404).json({ error: "Aucun élève trouvé pour cette classe" });
    }

    // 3. Envoi email + WhatsApp en parallèle
    const [mailResult, waResult] = await Promise.all([
      sendClassCodeToStudents(students, codeDoc.code, codeDoc.lienTP),
      sendWhatsAppToStudents(students, codeDoc.code, codeDoc.lienTP),
    ]);

    // 4. Mise à jour du code comme actif
    codeDoc.actif = true;
    await codeDoc.save();

    res.json({
      message: `Code envoyé : ${mailResult.sent}/${mailResult.total} par email et ${waResult.sent}/${waResult.total} via WhatsApp`,
      emailSent: mailResult.sent,
      whatsappSent: waResult.sent,
      total: students.length,
      codeId: codeDoc._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'envoi du code" });
  }
};



// Fonction pour générer un code aléatoire
const generateCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// Génère un code unique (vérifie dans la base)
const generateUniqueCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = generateCode(8); // 8 caractères alphanumériques
    const existing = await CodeClasse.findOne({ code });
    exists = !!existing;
  }
  return code;
};

exports.ajouterCodeClasse = async (req, res) => {
  try {
    const { nom, date_debut, expiration, lienTP, classe, quiz, simulation } = req.body;

    // Générer un code unique
    const code = await generateUniqueCode();

    const nouveauCode = new CodeClasse({
      nom,
      code,
      date_debut,
      expiration,
      lienTP,
      classe,
      quiz,
      simulation,
      user: req.user._id // utilisateur connecté
    });

    const savedCode = await nouveauCode.save();

    res.status(201).json({
      message: "Code de classe créé avec succès",
      codeClasse: savedCode
    });
  } catch (error) {
    console.error("Erreur création codeClasse:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/codes/classe/:classeId
exports.getCodesByClasse = async (req, res) => {
  try {
    const { classeId } = req.params;

    const codes = await CodeClasse.find({ classe: classeId })
      .populate("quiz", "titre") // facultatif : affiche le titre du quiz
      .populate("simulation", "titre") // facultatif : affiche le titre de la simulation
      .populate("user", "nom prenom email"); // facultatif : infos sur le créateur

    res.status(200).json(codes);
  } catch (error) {
    console.error("Erreur récupération des codes de classe :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des codes de classe" });
  }
};


// Lister tous les codes de classe
exports.listCodeClasses = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user._id };

        const codes = await CodeClasse.find(query)
            .populate('classe', 'nom_classe')
            .populate('quiz', 'titre')
            .populate('simulation', 'titre');

        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un code de classe par ID
exports.getCodeClasseById = async (req, res) => {
    try {
        const code = await CodeClasse.findById(req.params.id)
            .populate('classe')
            .populate('quiz')
            .populate('simulation');

        if (!code) return res.status(404).json({ message: "Code non trouvé" });

        // Vérification d'accès
        if (req.user.role !== 'admin' && code.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        res.json(code);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un code de classe
exports.updateCodeClasse = async (req, res) => {
    try {
        const code = await CodeClasse.findById(req.params.id);
        if (!code) return res.status(404).json({ message: "Code introuvable" });

        if (req.user.role !== 'admin' && code.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        const updated = await CodeClasse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Code mis à jour", codeClasse: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un code de classe
exports.deleteCodeClasse = async (req, res) => {
    try {
        const code = await CodeClasse.findById(req.params.id);
        if (!code) return res.status(404).json({ message: "Code non trouvé" });

        if (req.user.role !== 'admin' && code.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        await code.deleteOne();
        res.json({ message: "Code supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
