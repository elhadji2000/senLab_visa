const express = require('express');
const router = express.Router();
const classeController = require("../controllers/classe.controller");
const authenticate = require('../middleware/authMiddleware'); // <-- importer le middleware

router.post("/add", authenticate, classeController.ajouterClasse);
router.get("/all", authenticate, classeController.listClasses);
router.get("/count", authenticate, classeController.countClasses); // (si tu ajoutes une route comme ça)
router.put("/update/:id", authenticate, classeController.updateClasse);
router.delete("/delete/:id", authenticate, classeController.deleteClasse);

//  la route dynamique en dernier
router.get('/:id', authenticate, classeController.getClasseById);



module.exports = router;