// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.JWT_SECRET;

// Fonction pour obtenir les détails d'un utilisateur (Admin uniquement)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fonction pour obtenir les détails d'un utilisateur spécifique (Admin ou utilisateur lui-même)
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    // Vérifier si l'utilisateur est un admin ou s'il demande ses propres détails
    if (req.user.role === 'admin' || req.user.id === userId) {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fonction pour modifier les détails d'un utilisateur (Utilisateur lui-même)
const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  // Vérifier si l'utilisateur est authentifié et modifie ses propres informations
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fonction pour supprimer un utilisateur (Utilisateur lui-même ou Admin)
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  // Vérifier si l'utilisateur est authentifié et supprime son propre compte ou si c'est un admin
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
