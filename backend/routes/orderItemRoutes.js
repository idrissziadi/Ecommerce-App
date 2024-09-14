// routes/orderItemRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const orderItemController = require('../controllers/orderItemController');

// Routes pour les éléments de commande
router.get('/', authenticateToken, authorizeAdmin, orderItemController.getAllOrderItems); // Obtenir tous les éléments de commande (auth admin)
router.get('/:id', authenticateToken, orderItemController.getOrderItemById); // Obtenir un élément de commande par ID (auth utilisateur)
router.post('/', authenticateToken, orderItemController.createOrderItem); // Créer un élément de commande (auth utilisateur)
router.put('/:id', authenticateToken, orderItemController.updateOrderItem); // Mettre à jour un élément de commande (auth utilisateur/admin)
router.delete('/:id', authenticateToken, authorizeAdmin, orderItemController.deleteOrderItem); // Supprimer un élément de commande (auth admin)

module.exports = router;
