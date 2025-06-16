const CodeClasse = require("../models/codeClasse.model");

// 🔹 Ajouter un code de classe
exports.ajouterCodeClasse = async (req, res) => {
    try {
        const { nom, code, description, date_debut, expiration, classe, quiz, simulation } = req.body;

        const nouveauCode = new CodeClasse({
            nom,
            code,
            description,
            date_debut,
            expiration,
            classe,
            quiz,
            simulation
        });

        const savedCode = await nouveauCode.save();
        res.status(201).json({ message: "Code de classe créé avec succès", codeClasse: savedCode });
    } catch (error) {
        console.error("Erreur création codeClasse:", error);
        res.status(500).json({ error: error.message });
    }
};

// 🔹 Lister tous les codes de classe
exports.listCodeClasses = async (req, res) => {
    try {
        const codes = await CodeClasse.find()
            .populate('classe', 'nom')
            .populate('quiz', 'titre')
            .populate('simulation', 'titre');
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🔹 Récupérer un code de classe par ID
exports.getCodeClasseById = async (req, res) => {
    try {
        const code = await CodeClasse.findById(req.params.id)
            .populate('classe')
            .populate('quiz')
            .populate('simulation');
        if (!code) return res.status(404).json({ message: "Code non trouvé" });
        res.json(code);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🔹 Mettre à jour un code de classe
exports.updateCodeClasse = async (req, res) => {
    try {
        const updated = await CodeClasse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Code introuvable" });
        res.json({ message: "Code mis à jour", codeClasse: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🔹 Supprimer un code de classe
exports.deleteCodeClasse = async (req, res) => {
    try {
        const deleted = await CodeClasse.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Code non trouvé" });
        res.json({ message: "Code supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
