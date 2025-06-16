const Quiz = require('../models/Quiz.model');
const Question = require('../models/Question.model');
const Option = require('../models/Option.model');

// ➕ Ajouter un quiz complet avec questions et options
exports.addQuiz = async (req, res) => {
  try {
    const { titre, description, niveau, questions } = req.body;

    // Création du quiz
    const quiz = await new Quiz({
      titre,
      description,
      niveau,
      user: req.user._id
    }).save();

    // Ajout des questions et options si fournis
    if (Array.isArray(questions)) {
      for (const q of questions) {
        const question = await new Question({ titre: q.titre, quiz: quiz._id }).save();

        if (Array.isArray(q.options)) {
          const optionsToInsert = q.options.map(opt => ({
            text: opt.text,
            is_correct: opt.is_correct,
            note: opt.note,
            option: opt.option,
            question: question._id
          }));
          await Option.insertMany(optionsToInsert);
        }
      }
    }

    res.status(201).json({ success: true, message: "Quiz créé avec succès", quiz });
  } catch (error) {
    console.error("Erreur création quiz :", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📋 Lister les quiz de l'utilisateur (ou tous si admin)
exports.listQuizzes = async (req, res) => {
  try {
    const condition = req.user.role === 'admin' ? {} : { user: req.user.id };
    const quizzes = await Quiz.find(condition).populate('user', 'prenom nom email');
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔍 Récupérer un quiz avec ses questions/options
exports.getQuizWithQuestionsAndOptions = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id).populate('user', 'prenom nom email');
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz non trouvé" });

    if (req.user.role !== 'admin' && quiz.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const questions = await Question.find({ quiz: id });
    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        const options = await Option.find({ question: q._id });
        return { ...q.toObject(), options };
      })
    );

    res.json({ success: true, quiz, questions: questionsWithOptions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✏️ Mettre à jour un quiz
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

    const updated = await quiz.save();
    res.json({ success: true, message: "Quiz mis à jour", quiz: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ❌ Supprimer un quiz + questions + options associées
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz non trouvé" });

    if (req.user.role !== 'admin' && quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const questionIds = await Question.find({ quiz: id }).distinct('_id');
    await Option.deleteMany({ question: { $in: questionIds } });
    await Question.deleteMany({ quiz: id });
    await quiz.deleteOne();

    res.json({ success: true, message: "Quiz supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔢 Compter les quiz visibles par l'utilisateur
exports.countQuizzes = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const count = await Quiz.countDocuments(filter);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
