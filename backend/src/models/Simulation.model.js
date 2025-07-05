const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  titre: { 
    type: String, 
    required: [true, 'Le titre est obligatoire'] 
  },
  description: { 
    type: String, 
    required: [true, 'La description est obligatoire'] 
  },
  categorie: { 
    type: String, 
    required: [true, 'La catégorie est obligatoire'],
    enum: ['Mathematique', 'Physique', 'Chimie', 'Biologie']
  },
  niveau: { 
    type: String, 
    required: [true, 'Le niveau est obligatoire'],
    enum: ['6e', '5e', '4e', '3e', '2nde', '1ère', 'Terminale']
  },
  photo: { 
    type: String, 
    required: [true, 'La photo est obligatoire'] 
  },
  simulation: { 
    type: String, 
    required: [true, 'Le fichier de simulation est obligatoire'] 
  },
 user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required: true
   }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Simulation', simulationSchema);