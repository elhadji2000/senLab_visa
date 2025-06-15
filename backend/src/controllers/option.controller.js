const Option = require('../models/Option.model');

// Ajouter une option
exports.addOption = async (req, res) => {
  try {
    const { is_correct, option, question } = req.body;

    if (typeof is_correct === 'undefined' || !option || !question) {
      return res.status(400).json({ error: 'is_correct, option et question sont requis' });
    }

    const newOption = new Option({ is_correct, option, question });
    const savedOption = await newOption.save();

    res.status(201).json(savedOption);
  } catch (error) {
    console.error('Erreur ajout option:', error);
    res.status(500).json({ error: error.message });
  }
};

// Modifier une option
exports.updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_correct, option, question } = req.body;

    const updatedData = {};
    if (typeof is_correct !== 'undefined') updatedData.is_correct = is_correct;
    if (option) updatedData.option = option;
    if (question) updatedData.question = question;

    const updatedOption = await Option.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedOption) {
      return res.status(404).json({ error: 'Option non trouvée' });
    }

    res.json(updatedOption);
  } catch (error) {
    console.error('Erreur modification option:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une option
exports.deleteOption = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOption = await Option.findByIdAndDelete(id);

    if (!deletedOption) {
      return res.status(404).json({ error: 'Option non trouvée' });
    }

    res.json({ message: 'Option supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression option:', error);
    res.status(500).json({ error: error.message });
  }
};

// Lister toutes les options avec la question liée
exports.listOptions = async (req, res) => {
  try {
    const options = await Option.find().populate({
      path: 'question',
      select: 'titre quiz',
      populate: { path: 'quiz', select: 'titre' }
    });
    res.json(options);
  } catch (error) {
    console.error('Erreur listage options:', error);
    res.status(500).json({ error: error.message });
  }
};

// Lister les options d’une question spécifique
exports.listOptionsByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const options = await Option.find({ question: questionId });
    res.json(options);
  } catch (error) {
    console.error('Erreur listage options par question:', error);
    res.status(500).json({ error: error.message });
  }
};
