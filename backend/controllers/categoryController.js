// controllers/categoryController.js
const {   sequelize,
    User,
    Order,
    OrderItem,
    Product,
    Category,} = require('../models/index');
// Récupérer toutes les catégories avec leurs produits associés


// Récupérer toutes les catégories avec leurs produits associés
const getAllCategories = async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: Product,
            as: 'products', // Alias used in the association
          },
        ],
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };


// Récupérer une catégorie par ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Créer une nouvelle catégorie
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newCategory = await Category.create({
      name,
      description,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mettre à jour une catégorie
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const [updated] = await Category.update({
      name,
      description,
    }, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const updatedCategory = await Category.findByPk(id);
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Supprimer une catégorie
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Category.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
