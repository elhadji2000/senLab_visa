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
            simulation,
            user: req.user._id // associer à l'utilisateur courant
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

// 🔹 Récupérer un code de classe par ID
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

// 🔹 Mettre à jour un code de classe
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

// 🔹 Supprimer un code de classe
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
