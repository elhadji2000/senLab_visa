const User = require('../models/UserModel');

// ✅ Ajouter un utilisateur avec image
exports.addUser = async (req, res) => {
    try {
        const { prenom, nom, email, telephone, password, role, status } = req.body;

        const user = new User({
            prenom,
            nom,
            email,
            telephone,
            password,
            role,
            status,
            image: req.file ? req.file.path : null,
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Liste des utilisateurs
exports.listerUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
