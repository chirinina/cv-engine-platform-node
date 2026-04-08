const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Create a new client user (admin only)
exports.createClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    let existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const client = await User.create({
      name,
      email,
      password_hash,
      role: 'CLIENT'
    });

    res.status(201).json({ message: 'Client created successfully', client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all clients (admin only)
exports.getClients = async (req, res) => {
  try {
    const clients = await User.findAll({ where: { role: 'CLIENT' } });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update client name and email (admin only)
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
      if (existing) return res.status(400).json({ message: 'El correo ya está en uso por otro usuario' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(req.body.password, salt);
    }
    await user.save();

    res.json({ message: 'Cliente actualizado correctamente', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get me (current user)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
