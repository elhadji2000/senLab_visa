const express = require('express');
const { addUser, listerUsers } = require('../controllers/user.controller');
const router = express.Router();

router.post('/', addUser);
router.get('/', listerUsers);

module.exports = router;