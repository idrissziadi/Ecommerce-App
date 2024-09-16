const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Routes for users
router.get('/', authenticateToken, authorizeAdmin, userController.getAllUsers); // Get all users
router.get('/:id', authenticateToken, authorizeAdmin, userController.getUserById); // Get a user by ID
router.post('/', authenticateToken, authorizeAdmin, userController.createUser); // Create a new user
router.put('/:id', authenticateToken, authorizeAdmin, userController.updateUser); // Update a user
router.delete('/:id', authenticateToken, authorizeAdmin, userController.deleteUser); // Delete a user

module.exports = router;
