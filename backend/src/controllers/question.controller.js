const Question = require('../models/Question.model');

// ➕ Ajouter une question
exports.addQuestion = async (req, res) => {
  try {
    const { titre, quiz } = req.body;

    if (!titre || !quiz) {
      return res.status(400).json({ success: false, message: 'Titre et quiz sont requis' });
    }

    const question = new Question({ titre, quiz });
    const savedQuestion = await question.save();

    res.status(201).json({ success: true, question: savedQuestion });
  } catch (error) {
    console.error('Erreur ajout question:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📋 Lister toutes les questions (avec info quiz)
exports.listQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('quiz', 'titre');
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error('Erreur liste questions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔍 Récupérer une question par son id (avec quiz)
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate('quiz', 'titre');
    if (!question) return res.status(404).json({ success: false, message: 'Question non trouvée' });

    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error('Erreur get question:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔄 Mettre à jour une question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, quiz } = req.body;

    const updated = await Question.findByIdAndUpdate(
      id,
      { titre, quiz },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Question non trouvée' });

    res.status(200).json({ success: true, question: updated });
  } catch (error) {
    console.error('Erreur update question:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ❌ Supprimer une question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Question non trouvée' });

    res.status(200).json({ success: true, message: 'Question supprimée avec succès' });
  } catch (error) {
    console.error('Erreur delete question:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📋 Lister les questions d’un quiz spécifique
exports.listQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await Question.find({ quiz: quizId }).populate('quiz', 'titre');
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error('Erreur liste questions par quiz:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
