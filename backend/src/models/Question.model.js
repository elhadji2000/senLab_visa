const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
