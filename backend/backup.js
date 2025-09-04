// utils/backup.js
const { MongoClient } = require("mongodb");

// Configurations depuis .env
const atlasUri = process.env.MONGO_URI_ATLAS || "mongodb+srv://diopelhadjimadiop:%3FAssbamba25@cluster0.1sioafu.mongodb.net/senLab?retryWrites=true&w=majority";
const localUri = process.env.MONGO_URI_LOCAL || "mongodb://localhost:27017/senLab";

/**
 * Migration bidirectionnelle
 * sens: "toLocal" -> Atlas vers Local
 *       "toAtlas" -> Local vers Atlas
 */
async function migrate(sens = "toLocal") {
  const sourceUri = sens === "toLocal" ? atlasUri : localUri;
  const targetUri = sens === "toLocal" ? localUri : atlasUri;

  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    await sourceClient.connect();
    await targetClient.connect();

    const sourceDb = sourceClient.db(sens === "toLocal" ? "senLab" : "senLab");
    const targetDb = targetClient.db(sens === "toLocal" ? "senLab" : "senLab");

    const collections = await sourceDb.listCollections().toArray();

    for (let coll of collections) {
      const name = coll.name;
      const data = await sourceDb.collection(name).find().toArray();

      if (data.length > 0) {
        await targetDb.collection(name).deleteMany({}); // éviter les doublons
        await targetDb.collection(name).insertMany(data);
        console.log(`Collection ${name} migrée (${data.length} documents) vers ${sens === "toLocal" ? "local" : "Atlas"}`);
      }
    }

    console.log(`Migration ${sens} terminée !`);
  } catch (err) {
    console.error("Erreur migration :", err);
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}

// Exports pour utilisation depuis le backend
module.exports = {
  migrate,
};
