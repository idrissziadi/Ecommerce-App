const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Category = require('./category');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category_id: { // Champ ajouté pour la clé étrangère
    type: DataTypes.INTEGER,
    references: {
      model: Category, // Modèle référencé
      key: 'id',      // Clé primaire dans le modèle Category
    },
    field: 'category_id',
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'products',
  timestamps: true,
});


// Association


module.exports = Product;
