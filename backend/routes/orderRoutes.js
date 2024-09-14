// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

// Routes pour les commandes
router.get('/', authenticateToken, authorizeAdmin, orderController.getAllOrders); // Obtenir toutes les commandes (auth admin)
router.get('/:id', authenticateToken, orderController.getOrderById); // Obtenir une commande par ID (auth utilisateur)
router.post('/',  orderController.createOrder); // Créer une commande (auth utilisateur)
router.put('/:id', authenticateToken, orderController.updateOrder); // Mettre à jour une commande (auth utilisateur/admin)
router.delete('/:id', authenticateToken, authorizeAdmin, orderController.deleteOrder); // Supprimer une commande (auth admin)

module.exports = router;
