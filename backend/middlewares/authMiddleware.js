// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
  // Extraction du token depuis l'en-tête Authorization
  const token = req.headers['authorization']?.split(' ')[1];

  // Vérification de la présence du token
  if (!token) return res.status(401).json({ message: 'Token required' });

  // Vérification de la validité du token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    // Ajout des informations de l'utilisateur décodé dans la requête
    req.user = user;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  // Vérification du rôle de l'utilisateur
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { authenticateToken, authorizeAdmin };
