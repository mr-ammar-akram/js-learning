const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

// User Registration Route  
router.post('/register', userController.registerUser);

module.exports = router;