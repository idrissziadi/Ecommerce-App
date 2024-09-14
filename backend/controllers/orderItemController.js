// controllers/categoryController.js
const {   sequelize,
    User,
    Order,
    OrderItem,
    Product,
    Category,} = require('../models/index');

// Récupérer tous les éléments de commande
const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll({
      include: [Order, Product] // Inclure les informations sur la commande et le produit
    });
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Récupérer un élément de commande par ID
const getOrderItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const orderItem = await OrderItem.findByPk(id, {
      include: [Order, Product] // Inclure les informations sur la commande et le produit
    });
    if (!orderItem) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    res.json(orderItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Créer un nouvel élément de commande
const createOrderItem = async (req, res) => {
  const { order_id, product_id, quantity, unit_price } = req.body;
  try {
    // Calculer le prix total
    const total_price = quantity * unit_price;

    // Créer le nouvel élément de commande
    const newOrderItem = await OrderItem.create({
      order_id,
      product_id,
      quantity,
      unit_price,
      total_price
    });

    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mettre à jour un élément de commande
const updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const { quantity, unit_price } = req.body;
  try {
    // Calculer le prix total
    const total_price = quantity * unit_price;

    const [updated] = await OrderItem.update({
      quantity,
      unit_price,
      total_price
    }, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    const updatedOrderItem = await OrderItem.findByPk(id);
    res.json(updatedOrderItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Supprimer un élément de commande
const deleteOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await OrderItem.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    res.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getAllOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
