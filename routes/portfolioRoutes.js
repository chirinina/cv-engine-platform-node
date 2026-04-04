const express = require('express');
const { getPortfolios, createPortfolio, getPortfolioBySlug, saveSection, updatePortfolio } = require('../controllers/portfolioController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Admin or Client Portfolios list
router.get('/', authMiddleware, getPortfolios);

// Admin create a portfolio assignment
router.post('/', authMiddleware, adminMiddleware, createPortfolio);

// Image Upload Endpoint
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Save or Update a Portfolio Section
router.post('/:portfolioId/sections', authMiddleware, saveSection);

// Update Portfolio Meta Info
router.put('/:id', authMiddleware, updatePortfolio);

// Get by custom user link (Slug for public rendering)
router.get('/slug/:slug', getPortfolioBySlug);

module.exports = router;
