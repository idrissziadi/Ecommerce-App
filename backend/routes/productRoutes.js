// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');

// Routes pour les produits
router.get('/', productController.getAllProducts); // Obtenir tous les produits
router.get('/:id', productController.getProductById); // Obtenir un produit par ID
router.post('/', authenticateToken, authorizeAdmin, productController.createProduct); // Créer un produit (auth admin)
router.put('/:id', authenticateToken, authorizeAdmin, productController.updateProduct); // Mettre à jour un produit (auth admin)
router.delete('/:id', authenticateToken, authorizeAdmin, productController.deleteProduct); // Supprimer un produit (auth admin)

module.exports = router;
