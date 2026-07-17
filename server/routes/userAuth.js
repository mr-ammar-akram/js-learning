const express = require('express');
const userController = require('../controller/userController');
const configController = require('../controller/configController');
const profileController = require('../controller/profileController');
// const jwt = require('jsonwebtoken');

const upload = require('../middleware/uploadAuth');
const router = express.Router();

// Get User by ID
router.get('/admin/profile/:user_id', userController.getUser);

// Get User Profile Image
router.post('/admin/profile/image', profileController.getProfileImage);

// Get All Users
router.get('/admin/users', userController.getAllUsers);

// Admin Exists or not
router.get('/admin-exists', configController.checkAdminExist);

// Admin Registration Route  
router.post('/admin-register', configController.adminRegister);

// User Registration Route  
router.post('/register', userController.registerUser);

// User Login Route
router.post('/login', userController.loginUser);

// User Verify OTP
router.post('/verify-otp', userController.verifyOTP);

// User Resend OTP
router.post('/resend-otp', userController.resendOTP);

//Profile image upload
router.post('/profile/image', upload.single('file'), profileController.profileImage);


module.exports = router;