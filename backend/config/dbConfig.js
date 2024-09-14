// config/dbConfig.js
require('dotenv').config(); // Charger les variables d'environnement

const { Sequelize } = require('sequelize');

// Initialiser Sequelize avec les variables d'environnement
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  logging: false, // Désactiver les logs SQL
});

module.exports = sequelize;
