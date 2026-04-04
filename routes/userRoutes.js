const express = require('express');
const { createClient, getClients, getMe, updateClient } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get current logged in user
router.get('/me', authMiddleware, getMe);

// Get all clients (Admin only)
router.get('/', authMiddleware, adminMiddleware, getClients);

// Create client (Admin only)
router.post('/', authMiddleware, adminMiddleware, createClient);

// Update client name/email (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateClient);

module.exports = router;
