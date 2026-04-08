const express = require('express');
const { getPortfolios, createPortfolio, getPortfolioBySlug, saveSection, updatePortfolio } = require('../controllers/portfolioController');
const { createInquiry, getPortfolioInquiries } = require('../controllers/portfolioInquiryController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();

const fs = require('fs');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderName = req.query.folder || 'general';
    // Basic validation to prevent path traversal
    folderName = folderName.replace(/[^a-zA-Z0-9_-]/g, '');
    const dir = path.join('uploads', folderName);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir + '/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Sanitize filename as well
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '');
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + safeName);
  }
});
const upload = multer({ storage: storage });

// Admin or Client Portfolios list
router.get('/', authMiddleware, getPortfolios);

// Admin create a portfolio assignment
router.post('/', authMiddleware, adminMiddleware, createPortfolio);

// Get inquiries for the logged-in client (or all for admin)
router.get('/inquiries', authMiddleware, getPortfolioInquiries);

// Image Upload Endpoint
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  const folderName = req.query.folder ? req.query.folder.replace(/[^a-zA-Z0-9_-]/g, '') : 'general';
  res.json({ url: `/uploads/${folderName}/${req.file.filename}` });
});

// Save or Update a Portfolio Section
router.post('/:portfolioId/sections', authMiddleware, saveSection);

// Update Portfolio Meta Info
router.put('/:id', authMiddleware, updatePortfolio);

// Get by custom user link (Slug for public rendering)
router.post('/slug/:slug/inquiries', createInquiry);
router.get('/slug/:slug', getPortfolioBySlug);

module.exports = router;
