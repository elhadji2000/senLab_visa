const codeClasse = require("../models/codeClasse.model");

// la liste de tous les classe
exports.listCodeClasses = async (req, res) => {
    try {
        const codeClasses = await codeClasse.find();
        res.json(codeClasses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.ajouterCode = async (req, res) =>{
    try {
        const {nom, matiere} = req.body;
        const code = new Classe({nom, matiere});
        const savedCode = await code.save();

        res.status(201).json({ message: "code créé avec succès", code: savedCode });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};