const Quiz = require('../models/QuizModel');
const Question = require('../models/QuestionModel');
const Option = require('../models/OptionModel');

// ➕ Ajouter un quiz
exports.addQuiz = async (req, res) => {
    try {
        const { titre, description, niveau, questions } = req.body;

        // Création du quiz principal
        const quiz = new Quiz({ titre, description, niveau });
        const savedQuiz = await quiz.save();

        // Ajouter les questions et options associées
        for (const questionData of questions) {
            const question = new Question({
                titre: questionData.titre,
                quiz: savedQuiz._id
            });
            const savedQuestion = await question.save();

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

        res.status(201).json({ message: "Quiz créé avec succès", quiz: savedQuiz });

    } catch (error) {
        console.error("Erreur lors de l'ajout du quiz complet :", error);
        res.status(500).json({ error: error.message });
    }
};


// 📋 Lister tous les quiz
exports.listQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🔍 Récupérer un quiz avec ses questions et options
exports.getQuizWithQuestionsAndOptions = async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer le quiz
        const quiz = await Quiz.findById(id);
        if (!quiz) return res.status(404).json({ message: "Quiz non trouvé" });

        // Récupérer les questions liées
        const questions = await Question.find({ quiz: id });

        // Pour chaque question, récupérer les options
        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const options = await Option.find({ question: question._id });
                return { ...question._doc, options };
            })
        );

        res.json({
            quiz,
            questions: questionsWithOptions
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du quiz :", error);
        res.status(500).json({ error: error.message });
    }
};
