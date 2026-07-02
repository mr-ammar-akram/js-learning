const express = require('express');
const userController = require('../controller/userController');
const configController = require('../controller/configController');
// const jwt = require('jsonwebtoken');

const router = express.Router();

// Admin Exists or not
router.get('/admin-exists', configController.checkAdminExist);

// Admin Registration Route  
router.post('/admin-register', configController.adminRegister);

// User Registration Route  
router.post('/register', userController.registerUser);

// User Login Route
router.post('/login', userController.loginUser);

module.exports = router;