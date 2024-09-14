const {   sequelize,
    User,
    Order,
    OrderItem,
    Product,
    Category,} = require('../models/index');


const getAllProducts = async (req, res) => {
    try {
      const products = await Product.findAll({
        include: {
          model: Category,
          as: 'category', // Assurez-vous que l'alias est correct
        },
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id, {
        include: {
          model: Category,
          as: 'category', // Assurez-vous que l'alias est correct
        },
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

// Créer un nouveau produit
const createProduct = async (req, res) => {
  const { name, description, price, stock, image_url, category_id } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      image_url,
      category_id,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mettre à jour un produit
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image_url, category_id } = req.body;
  try {
    const [updated] = await Product.update({
      name,
      description,
      price,
      stock,
      image_url,
      category_id,
    }, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const updatedProduct = await Product.findByPk(id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Supprimer un produit
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Product.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
