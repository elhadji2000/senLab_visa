const dotenv = require("dotenv");
dotenv.config({ path: require("path").resolve(__dirname, "../.env") });

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

//  Ajouter un utilisateur
const transporter = require("../config/mailer");

exports.addUser = async (req, res) => {
  try {
    const { prenom, nom, email, password, telephone, role, status } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    // Création utilisateur
    const user = new User({
      prenom,
      nom,
      email,
      password, // déjà hashé par le middleware User
      telephone,
      role,
      status,
    });

    await user.save();

    //  ---- ENVOI DE L'EMAIL ----
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: "Vos accès SenLab - IMPORTANT",
        template: "credentials", // Nom du template handlebars (credentials.hbs)
        context: {
          prenom: user.prenom,
          nom: user.nom,
          email: user.email,
          password: password,
        },
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi du mail:", emailError);
    }

    // Réponse sans mot de passe
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      message: "Utilisateur créé et email envoyé avec succès.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Cet email ou téléphone est déjà utilisé",
      });
    }
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};


//  Lister tous les utilisateurs
exports.listerUsers = async (req, res) => {
  try {
    // Trier par ordre croissant sur le champ "nom"
    const users = await User.find()
      .select("-password")
      .sort({ nom: 1, prenom: 1 }); // 1 = croissant, -1 = décroissant

    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { prenom, nom, email, password, telephone, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Mise à jour des champs
    user.prenom = prenom || user.prenom;
    user.nom = nom || user.nom;
    user.email = email || user.email;
    user.telephone = telephone || user.telephone;
    user.role = role || user.role;

    if (password) {
      user.password = password; // sera hashé par le middleware pre('save')
    }

    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { ancienPassword, nouveauPassword, confirmPassword } = req.body;

    // Vérifier si tous les champs sont présents
    if (!ancienPassword || !nouveauPassword || !confirmPassword) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    // Vérifier si les deux nouveaux mots de passe correspondent
    if (nouveauPassword !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    // Trouver l'utilisateur + récupérer le champ password caché
    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier l'ancien mot de passe
    const match = await bcrypt.compare(ancienPassword, user.password);

    if (!match) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect." });
    }

    // Appliquer le nouveau mot de passe
    user.password = nouveauPassword; // sera hashé automatiquement via pre('save')

    await user.save();

    res.json({
      success: true,
      message: "Mot de passe modifié avec succès.",
    });

  } catch (error) {
    console.error("Erreur updatePassword :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

//  Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params; // ID de l'utilisateur passé dans l'URL
    const { status } = req.body;   // true = activer, false = désactiver

    // Vérifier que status est bien un booléen
    if (typeof status !== "boolean") {
      return res.status(400).json({ message: "Le champ 'status' doit être true ou false" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status }, // Met à jour le champ status
      { new: true, select: "-password" } // Retourne l’utilisateur mis à jour sans le mot de passe
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      message: status ? "Utilisateur activé avec succès" : "Utilisateur désactivé avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// GET /api/stats/users-evolution
exports.getUsersEvolution = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    const formatted = stats.map((s) => ({
      mois: s._id,
      users: s.count
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
