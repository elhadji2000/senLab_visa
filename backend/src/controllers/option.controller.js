const Option = require('../models/OptionModel');

exports.addOption = async (req, res) => {
    try {
        const { is_correct, note, question } = req.body;

        const option = new Option({ is_correct, note, question });
        const savedOption = await option.save();

        res.status(201).json(savedOption);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listOptions = async (req, res) => {
    try {
        const options = await Option.find().populate('question');
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
