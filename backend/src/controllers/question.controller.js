const Question = require('../models/QuestionModel');

exports.addQuestion = async (req, res) => {
    try {
        const { titre, quiz } = req.body;

        const question = new Question({ titre, quiz });
        const savedQuestion = await question.save();

        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate('quiz');
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
