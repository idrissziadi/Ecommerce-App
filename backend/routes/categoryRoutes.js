// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/categoryController');

// Routes pour les catégories
router.get('/', authenticateToken, categoryController.getAllCategories); // Obtenir toutes les catégories
router.get('/:id', authenticateToken, categoryController.getCategoryById); // Obtenir une catégorie par ID
router.post('/', authenticateToken, authorizeAdmin, categoryController.createCategory); // Créer une catégorie (auth admin)
router.put('/:id', authenticateToken, authorizeAdmin, categoryController.updateCategory); // Mettre à jour une catégorie (auth admin)
router.delete('/:id',  categoryController.deleteCategory); // Supprimer une catégorie (auth admin)

module.exports = router;
