const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// ✅ Ajouter un utilisateur avec image et mot de passe crypté
exports.addUser = async (req, res) => {
    // Validation des données
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { prenom, nom, email, telephone, password, role, status } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
        }

        // Cryptage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            prenom,
            nom,
            email,
            telephone,
            password: hashedPassword, // Stockage du mot de passe crypté
            role,
            status,
            image: req.file ? req.file.path : null,
        });

        const savedUser = await user.save();
        
        // Ne pas renvoyer le mot de passe dans la réponse
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: userResponse
        });

    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ✅ Liste des utilisateurs (sans mots de passe)
exports.listerUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclure le champ password
        res.json(users);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};