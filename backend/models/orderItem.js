const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Order = require('./order'); // Assurez-vous que ce fichier existe
const Product = require('./Product'); // Assurez-vous que ce fichier existe

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Order, // Modèle `Order` correctement référencé
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product, // Modèle `Product` correctement référencé
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = OrderItem;
