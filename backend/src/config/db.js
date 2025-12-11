const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connexion à MongoDB réussie");
  } catch (error) {
    console.error(" Erreur MongoDB :", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
