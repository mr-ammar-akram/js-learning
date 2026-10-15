const express = require('express');
const userController = require('../controller/userController');
const configController = require('../controller/configController');
const categoryController = require('../controller/categoryController');
const tagController = require('../controller/tagController');
const profileController = require('../controller/profileController');
const postController = require('../controller/postController');
const membershipController = require('../controller/membershipController');
const planController = require('../controller/planController');
const PaymentService = require('../payments/PaymentService');

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

// Delete User by ID    
router.delete('/admin/user/delete/:id', userController.deleteUser);

// Update User by ID    
router.put('/admin/user/update/:id', userController.updateUser);

// Add Post
router.post('/admin/post/add', upload.single('file'), postController.addPost);

// Get All Posts
router.get('/admin/posts', postController.getPosts);

// Get All Posts on frontend
router.post('/posts', postController.getAllPosts);

// Get post by slug
router.get('/post/:slug', postController.getPostBySlug);

// Delete Post
router.delete('/admin/post/delete/:id', postController.deletePost);

// Get Post by id
router.get('/admin/post/:id', postController.getPost);

// Update Post
router.put('/admin/post/update/:id', upload.single('file'), postController.updatePost);

// Get All Categories
router.get('/admin/categories', categoryController.getAllCategories);

// Add Post Category
router.post('/admin/post-category/add', upload.single('file'), categoryController.addCategory);

// Delete Post Category
router.delete('/admin/post-category/delete/:id', categoryController.deleteCategory);

// Get Category by id
router.get('/admin/category/:id', categoryController.getCategoryById);

// Update Category
router.put('/admin/category/update/:id', upload.single('file'), categoryController.updateCategory);

// Add Post Tag
router.post('/admin/post-tag/add', tagController.addCatTag);

// Get All Tags
router.get('/admin/tags', tagController.getAllTags);

// Delete Post Tag
router.delete('/admin/post-tag/delete/:id', tagController.deleteTag);

// Get Tag by id
router.get('/admin/tag/:id', tagController.getTagById);

// Update Tag
router.put('/admin/tag/update/:id', tagController.updateTag);

// Add Membership
router.post('/admin/membership/add', upload.single('file'), membershipController.addMembership);

// Get All Memberships
router.get('/admin/memberships', membershipController.getAllMemberships);

// Delete Membership
router.delete('/admin/membership/delete/:id', membershipController.deleteMembership);

// Get Membership by id
router.get('/admin/membership/:id', membershipController.getMembershipById);

// Update Membership
router.put('/admin/membership/update/:id', upload.single('file'), membershipController.updateMembership);

// Get All Memberships
router.get('/memberships', membershipController.getMemberships);

// Add Plan
router.post('/admin/plan/add',  planController.addPlan);

// Get All Plans
router.get('/admin/membership-plans', planController.getAllPlans);

// Delete Plan
router.delete('/admin/plan/delete/:id', planController.deletePlan);

// Get Plan by id
router.get('/admin/plan/:id', planController.getPlanById);

// Update Plan
router.put('/admin/plan/update/:id', planController.updatePlan);

// Add Payment Route
router.post('/payments/charge', PaymentService.charge);

// Get Payment by Id
router.get('/payment/order/:id', PaymentService.getPaymentById);

module.exports = router;