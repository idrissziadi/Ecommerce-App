// controllers/orderController.js
// controllers/categoryController.js
const {   sequelize,
    User,
    Order,
    OrderItem,
    Product,
    Category,} = require('../models/index');
// Récupérer toutes les commandes
const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          { 
            model: User, 
            as: 'user', // Utilisation de l'alias 'user' défini dans l'association
            attributes: ['id', 'username', 'email' , 'phone_number' ] // Sélectionner les attributs pertinents
          },
          { 
            model: OrderItem, 
            as: 'orderItems', // Utilisation de l'alias 'orderItems' défini dans l'association
            include: [
              { 
                model: Product, 
                as: 'product', // Utilisation de l'alias 'product' défini dans l'association
                attributes: ['id', 'name', 'price'] // Sélectionner les attributs pertinents pour le produit
              }
            ]
          }
        ]
      });
      res.json(orders);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  
  

// Récupérer une commande par ID
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id, {
      include: [User, { model: OrderItem, include: ['Product'] }] // Inclure les informations sur l'utilisateur et les produits
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Créer une nouvelle commande
const createOrder = async (req, res) => {
    const { userId, shippingAddress, items, totalPrice } = req.body; // Assurez-vous que ces champs sont envoyés par la requête frontend
  
    try {
      // Vérifier si des articles ont été fournis
      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'La commande doit contenir au moins un article.' });
      }
  
      // Vérifier si l'adresse de livraison est fournie
      if (!shippingAddress) {
        return res.status(400).json({ message: 'L\'adresse de livraison est requise.' });
      }
  
      // Créer une nouvelle commande
      const newOrder = await Order.create({
        user_id: userId,
        status: 'Pending', // Statut initial de la commande
        total_amount: totalPrice, // Total calculé du panier
        shipping_address: shippingAddress // Adresse de livraison
      });
  
      // Préparer les articles de la commande
      const orderItems = [];
  
      for (const item of items) {
        const product = await Product.findByPk(item.productId); // Récupérer chaque produit par son ID
  
        if (!product) {
          return res.status(404).json({ message: `Le produit avec l'ID ${item.productId} est introuvable.` });
        }
  
        // Calculer le prix total de chaque article
        const unit_price = product.price;
        const total_price = item.quantity * unit_price;
  
        orderItems.push({
          order_id: newOrder.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price,
          total_price,
        });
      }
  
      // Ajouter les articles à la commande
      await OrderItem.bulkCreate(orderItems);
  
      // Retourner la commande créée avec ses articles
      res.status(201).json({
        message: 'Commande créée avec succès.',
        order: newOrder,
        items: orderItems,
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      res.status(500).json({ message: 'Erreur du serveur', error });
    }
  };
  
  

// Mettre à jour une commande
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, total_amount, shipping_address } = req.body;
  try {
    const [updated] = await Order.update({
      status,
      total_amount,
      shipping_address
    }, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const updatedOrder = await Order.findByPk(id);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Supprimer une commande
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Order.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const updateOrderStatus = async (req, res) => {
    const { status } = req.body; // Get the new status from the request
    const orderId = req.params.id; // Get the order ID from the URL params
  
    try {
      // Find the order by its primary key (ID)
      const order = await Order.findByPk(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Update the status of the order
      order.status = status;
      await order.save();
  
      res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update order status' });
    }
  };
  
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus 
};
