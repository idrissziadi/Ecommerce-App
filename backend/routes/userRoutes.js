// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Route pour obtenir tous les utilisateurs (Admin uniquement)
router.get('/', authenticateToken, authorizeAdmin, userController.getAllUsers);

// Route pour obtenir les détails d'un utilisateur spécifique (Admin ou utilisateur lui-même)
router.get('/:id', authenticateToken, userController.getUserById);

// Route pour mettre à jour les détails d'un utilisateur (Utilisateur lui-même)
router.put('/:id', authenticateToken, userController.updateUser);

// Route pour supprimer un utilisateur (Utilisateur lui-même ou Admin)
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
