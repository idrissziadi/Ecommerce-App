const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true, // Permettre null si le numéro de téléphone n'est pas obligatoire
    validate: {
      is: /^\+?[1-9]\d{1,14}$/, // Validation pour un numéro de téléphone au format international
    },
  },
  user_type: {
    type: DataTypes.ENUM('customer', 'admin'), // Deux types d'utilisateurs : client et administrateur
    allowNull: false,
    defaultValue: 'customer',
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
  tableName: 'users', // Nom de la table dans la base de données
  timestamps: true, // Gère automatiquement les champs createdAt et updatedAt
});



module.exports = User;
