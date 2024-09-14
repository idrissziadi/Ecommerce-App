const { Sequelize } = require('sequelize');
const sequelize = require('../config/dbConfig');

// Import models
const User = require('./User');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Product = require('./product');
const Category = require('./category');

// Define associations
// User <-> Order
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Order <-> OrderItem
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'orderItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Product <-> OrderItem
Product.hasMany(OrderItem, {
  foreignKey: 'product_id',
  as: 'orderItems',
  onDelete: 'SET NULL', // or 'CASCADE' depending on your requirements
  onUpdate: 'CASCADE',
});

OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
  onDelete: 'SET NULL', // or 'CASCADE' depending on your requirements
  onUpdate: 'CASCADE',
});

// Category <-> Product
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
});

module.exports = {
  sequelize,
  User,
  Order,
  OrderItem,
  Product,
  Category,
};
