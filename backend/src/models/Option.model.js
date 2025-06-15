const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  is_correct: { type: Boolean, required: true },
  option: { type: String, required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Option', optionSchema);
