const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  is_correct: { type: Boolean, required: true },
  note: { type: Number, default: 0 },
  option: { type: String, required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Option', optionSchema);
