// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/dbConfig'); // Assurez-vous que le chemin vers votre fichier dbConfig est correct
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const path = require('path');
app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);

// Synchroniser les modèles et démarrer le serveur
sequelize.sync({ force: false }) // Utilisez 'force: true' uniquement si vous voulez réinitialiser les tables à chaque démarrage
  .then(() => {
    console.log('Database connected successfully!');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => console.error('Unable to connect to the database:', err));
