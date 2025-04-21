const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27018/senLab");
    console.log("✅ Connexion à MongoDB réussie");
  } catch (error) {
    console.error("❌ Erreur MongoDB :", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
