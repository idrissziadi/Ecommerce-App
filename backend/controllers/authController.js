// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.JWT_SECRET;

// Inscription d'un utilisateur
const signup = async (req, res) => {
  const { username, email, password, phone_number, role } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone_number,
      user_type: role || 'customer' // Par défaut, rôle est 'customer'
    });

    // Génération du token JWT
    const token = jwt.sign({ id: newUser.id, role: newUser.user_type }, secret, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone_number: newUser.phone_number,
        role: newUser.user_type,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user.id, role: user.user_type }, secret, { expiresIn: '1h' });

    // Retourner les informations de l'utilisateur avec le token
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.user_type,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message || error });

  }
};

module.exports = { signup, login };
