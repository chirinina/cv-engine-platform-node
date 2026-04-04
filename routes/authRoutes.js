const express = require('express');
const { login, setupAdmin } = require('../controllers/authController');
const routerInstance = express.Router();

routerInstance.post('/login', login);
routerInstance.post('/setup', setupAdmin);

module.exports = routerInstance;
