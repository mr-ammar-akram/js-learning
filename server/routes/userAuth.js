const express = require('express');
const userController = require('../controller/userController');
// const jwt = require('jsonwebtoken');

const router = express.Router();

// User Registration Route  
router.post('/register', userController.registerUser);

// User Login Route
router.post('/login', userController.loginUser);

module.exports = router;