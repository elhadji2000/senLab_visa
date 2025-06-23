const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate); // Toutes les routes sont protégées

// CRUD complet
router.post('/add', userController.addUser);
router.get('/all', userController.listerUsers);
router.get('/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;
