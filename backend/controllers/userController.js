const { User } = require('../models/index');
const bcrypt = require('bcrypt');
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new user
const createUser = async (req, res) => {
    const { username, email, password, phone_number, user_type } = req.body;
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        phone_number,
        user_type
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Update a user
  const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, phone_number, user_type } = req.body;
    
    try {
      // Fetch existing user to check if user exists
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Prepare the updated data
      const updatedData = {
        username,
        email,
        phone_number,
        user_type
      };
  
      // Hash the new password if provided
      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }
  
      // Update the user
      const [updated] = await User.update(updatedData, {
        where: { id },
      });
  
      if (!updated) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Fetch the updated user
      const updatedUser = await User.findByPk(id);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Delete a user
  const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await User.destroy({
        where: { id },
      });
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
