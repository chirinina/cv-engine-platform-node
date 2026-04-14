const { User, Portfolio } = require('../models');
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
    const { page, search = '', isActive, hasPortfolio } = req.query;
    const limit = parseInt(req.query.limit, 10) || 6;

    const where = { role: 'CLIENT' };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (isActive !== undefined && isActive !== 'all') {
      where.isActive = isActive === 'active';
    }

    const include = [];
    if (hasPortfolio !== undefined && hasPortfolio !== 'all') {
      const exists = hasPortfolio === 'with';
      // To filter by users who have/don't have a portfolio
      // We can use a subquery or a required include for "with"
      if (exists) {
        include.push({
          model: Portfolio,
          required: true,
          attributes: ['id']
        });
      } else {
        // Users without portfolio: use a NOT EXISTS logic or left join where portfolio is null
        // Sequelize approach: include with required: false and where portfolio.id is null
        include.push({
          model: Portfolio,
          required: false,
          attributes: ['id']
        });
        where['$Portfolio.id$'] = null;
      }
    }

    if (page) {
      const p = parseInt(page, 10);
      const offset = (p - 1) * limit;
      const { count, rows } = await User.findAndCountAll({
        where,
        include,
        limit,
        offset,
        distinct: true, // Important when using includes with findAndCountAll
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        data: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: p
      });
    }

    // Default behavior for backward compatibility
    const clients = await User.findAll({ 
      where,
      include,
      order: [['createdAt', 'DESC']]
    });
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
// Delete a client (admin only)
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 2. Security: Ensure we are not deleting an ADMIN through this client management route
    if (user.role === 'ADMIN') {
      return res.status(403).json({ message: 'No se pueden eliminar administradores desde esta sección' });
    }

    // 3. Security: Prevent an admin from deleting themselves (if they accidentally targeted their own ID)
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
    }

    // 4. Perform deletion
    // Note: Associations like Portfolios and Inquiries will be deleted via Cascade at DB level
    await user.destroy();

    res.json({ message: 'Cliente y toda su información asociada eliminados correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
