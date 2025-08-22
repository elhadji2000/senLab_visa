const Quiz = require("../models/Quiz.model");
const Question = require("../models/Question.model");
const Option = require("../models/Option.model");
const CodeClasses = require("../models/codeClasse.model");
const Eleves = require("../models/Eleve.model");
const Resultats = require("../models/Resultat.model");

// Ajouter un quiz complet avec questions et options
exports.addQuiz = async (req, res) => {
  try {
    const { titre, description, niveau, categorie, isPublic, questions } =
      req.body;

    // Création du quiz
    const quiz = await new Quiz({
      titre,
      description,
      niveau,
      categorie,
      isPublic,
      user: req.user._id,
    }).save();

    // Ajout des questions et options si fournis
    if (Array.isArray(questions)) {
      for (const q of questions) {
        const question = await new Question({
          titre: q.titre,
          quiz: quiz._id,
        }).save();

        if (Array.isArray(q.options)) {
          const optionsToInsert = q.options.map((opt) => ({
            is_correct: opt.is_correct,
            option: opt.option,
            question: question._id,
          }));
          await Option.insertMany(optionsToInsert);
        }
      }
    }

    res
      .status(201)
      .json({ success: true, message: "Quiz créé avec succès", quiz });
  } catch (error) {
    console.error("Erreur création quiz :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//Lister les quiz de l'utilisateur (ou tous si admin)
exports.listQuizzes = async (req, res) => {
  try {
    const condition = req.user.role === "admin" ? {} : { user: req.user.id };

    const quizzes = await Quiz.aggregate([
      { $match: condition },
      { $sort: { createdAt: -1 } },
      // Joindre les questions liées au quiz
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "quiz",
          as: "questions",
        },
      },

      // Ajouter le champ nombre de questions
      {
        $addFields: {
          questionCount: { $size: "$questions" },
        },
      },

      // Supprimer le tableau des questions pour ne pas alourdir la réponse
      {
        $project: {
          questions: 0,
        },
      },
    ]);

    // Pour compléter avec les infos utilisateur (prenom, nom)
    const quizzesWithUser = await Quiz.populate(quizzes, {
      path: "user",
      select: "prenom nom email",
    });

    res.json({ success: true, quizzes: quizzesWithUser });
  } catch (error) {
    console.error("Erreur lors du chargement des quiz :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Récupérer un quiz avec ses questions/options
// controllers/quizController.js
exports.getQuizWithQuestionsAndOptions = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id).populate("user", "prenom nom email");
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz non trouvé" });
    }

    // 🔐 Si le quiz n'est pas public, on peut ajouter une restriction ici si tu veux :
    // if (!quiz.isPublic) {
    //   return res.status(403).json({ success: false, message: "Ce quiz n'est pas public" });
    // }

    const questions = await Question.find({ quiz: id });

    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        const options = await Option.find({ question: q._id });
        return { ...q.toObject(), options };
      })
    );

    res.json({ success: true, quiz, questions: questionsWithOptions });
  } catch (error) {
    console.error("Erreur getQuizWithQuestionsAndOptions :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, niveau, categorie, isPublic, questions } =
      req.body;

    // Vérifier que le quiz existe
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz non trouvé" });
    }

    // Vérification de permission
    if (req.user.role !== "admin" && quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    // Mettre à jour les champs du quiz
    quiz.titre = titre ?? quiz.titre;
    quiz.description = description ?? quiz.description;
    quiz.niveau = niveau ?? quiz.niveau;
    quiz.categorie = categorie ?? quiz.categorie;
    quiz.isPublic = isPublic ?? quiz.isPublic;
    await quiz.save();

    // Supprimer toutes les anciennes questions et options
    const oldQuestions = await Question.find({ quiz: quiz._id });
    const questionIds = oldQuestions.map((q) => q._id);

    await Option.deleteMany({ question: { $in: questionIds } });
    await Question.deleteMany({ _id: { $in: questionIds } });

    // Ajouter les nouvelles questions + options
    if (Array.isArray(questions)) {
      for (const q of questions) {
        const newQuestion = await new Question({
          titre: q.titre,
          quiz: quiz._id,
        }).save();

        if (Array.isArray(q.options)) {
          const optionsToInsert = q.options.map((opt) => ({
            option: opt.option, // champ correct
            is_correct: opt.is_correct,
            note: opt.note,
            question: newQuestion._id,
          }));
          await Option.insertMany(optionsToInsert);
        }
      }
    }

    res.json({ success: true, message: "Quiz mis à jour avec succès", quiz });
  } catch (error) {
    console.error("Erreur mise à jour quiz :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Supprimer un quiz + questions + options associées
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz non trouvé" });

    if (req.user.role !== "admin" && quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const questionIds = await Question.find({ quiz: id }).distinct("_id");
    await Option.deleteMany({ question: { $in: questionIds } });
    await Question.deleteMany({ quiz: id });
    await quiz.deleteOne();

    res.json({ success: true, message: "Quiz supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Compter les quiz visibles par l'utilisateur
exports.countQuizzes = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };
    const count = await Quiz.countDocuments(filter);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Quizz public visibles à tous
exports.getPublicQuizz = async (req, res) => {
  try {
    const quizz = await Quiz.find({ isPublic: true }).sort({ createdAt: -1 }); // trie décroissant

    res.status(200).json(quizz);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des quizz publics." });
  }
};

exports.getQuizzByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const codeClasse = await CodeClasses.findOne({ code }).populate("quiz");

    if (!codeClasse) {
      return res.status(404).json({ success: false, message: "Code invalide" });
    }

    const now = new Date();
    const dateDebut = new Date(codeClasse.date_debut);
    const expiration = new Date(codeClasse.expiration);

    if (now < dateDebut) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Le quiz n'est pas encore disponible",
        });
    }
    if (now > expiration) {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Ce quiz est expiré. Merci de contacter ton enseignant pour un nouveau lien.",
        });
    }

    const questions = await Question.find({ quiz: codeClasse.quiz._id });
    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        const options = await Option.find({ question: q._id });
        return { ...q.toObject(), options };
      })
    );

    res.json({
      success: true,
      quiz: codeClasse.quiz,
      questions: questionsWithOptions,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
  }
};
exports.submitQuizzParCode = async (req, res) => {
  const { code, email, answers } = req.body;

  try {
    const codeClasse = await CodeClasses.findOne({ code });
    if (!codeClasse) {
      return res.status(404).json({ success: false, message: "Code invalide" });
    }

    const now = new Date();
    const dateDebut = new Date(codeClasse.date_debut);
    const expiration = new Date(codeClasse.expiration);
    if (now < dateDebut || now > expiration) {
      return res
        .status(403)
        .json({ success: false, message: "Quiz hors période autorisée" });
    }

    const eleve = await Eleves.findOne({ email });
    if (!eleve) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Aucun élève trouvé avec cet email. Vérifie l’orthographe ou contacte ton enseignant.",
        });
    }

    let correct = 0;
    for (const answer of answers) {
      const correctOption = await Option.findOne({
        question: answer.questionId,
        is_correct: true,
      });
      if (correctOption && correctOption._id.toString() === answer.optionId) {
        correct++;
      }
    }

    const score = Math.round((correct / answers.length) * 100);
    const note = `${correct} / ${answers.length}`;

    const resultat = await Resultats.create({
      score,
      note,
      quiz: codeClasse.quiz,
      eleve: eleve._id,
    });

    res.json({ success: true, score, note });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
  }
};
