const Quiz = require('../models/Quiz.model');
const Question = require('../models/Question.model');
const Option = require('../models/Option.model');

// ➕ Ajouter un quiz
exports.addQuiz = async (req, res) => {
  try {
    const { titre, description, niveau, questions } = req.body;

    // Créer le quiz en liant l'utilisateur courant
    const quiz = new Quiz({
      titre,
      description,
      niveau,
      user: req.user._id
    });
    const savedQuiz = await quiz.save();

    // Ajouter questions et options liées
    if (Array.isArray(questions)) {
      for (const questionData of questions) {
        const question = new Question({
          titre: questionData.titre,
          quiz: savedQuiz._id
        });
        const savedQuestion = await question.save();

        if (Array.isArray(questionData.options)) {
          for (const optionData of questionData.options) {
            const option = new Option({
              text: optionData.text,
              is_correct: optionData.is_correct,
              note: optionData.note,
              option: optionData.option,
              question: savedQuestion._id
            });
            await option.save();
          }
        }
      }
    }

    res.status(201).json({ success: true, message: "Quiz créé avec succès", quiz: savedQuiz });
  } catch (error) {
    console.error("Erreur lors de l'ajout du quiz complet :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📋 Lister les quiz
exports.listQuizzes = async (req, res) => {
  try {
    let quizzes;

    if (req.user.role === 'admin') {
      quizzes = await Quiz.find().populate('user', 'prenom nom email');
    } else {
      quizzes = await Quiz.find({ user: req.user.id }).populate('user', 'prenom nom email');
    }

    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔍 Récupérer un quiz avec questions et options (avec contrôle d’accès)
exports.getQuizWithQuestionsAndOptions = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id).populate('user', 'prenom nom email');
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz non trouvé" });

    // Vérification d'accès : admin ou proprio
    if (req.user.role !== 'admin' && quiz.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const questions = await Question.find({ quiz: id });
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await Option.find({ question: question._id });
        return { ...question._doc, options };
      })
    );

    res.json({ success: true, quiz, questions: questionsWithOptions });
  } catch (error) {
    console.error("Erreur lors de la récupération du quiz :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔄 Mettre à jour un quiz (avec contrôle d’accès)
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, niveau } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz non trouvé" });

    if (req.user.role !== 'admin' && quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    quiz.titre = titre ?? quiz.titre;
    quiz.description = description ?? quiz.description;
    quiz.niveau = niveau ?? quiz.niveau;

    const updatedQuiz = await quiz.save();
    res.json({ success: true, message: "Quiz mis à jour", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ❌ Supprimer un quiz (avec contrôle d’accès)
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz non trouvé" });

    if (req.user.role !== 'admin' && quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    // Supprimer quiz + questions + options liées
    await Option.deleteMany({ question: { $in: await Question.find({ quiz: id }).distinct('_id') } });
    await Question.deleteMany({ quiz: id });
    await quiz.remove();

    res.json({ success: true, message: "Quiz supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔢 Nombre total de quiz (admin = tous, user = ses quiz)
exports.countQuizzes = async (req, res) => {
  try {
    let count;
    if (req.user.role === 'admin') {
      count = await Quiz.countDocuments();
    } else {
      count = await Quiz.countDocuments({ user: req.user.id });
    }
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
