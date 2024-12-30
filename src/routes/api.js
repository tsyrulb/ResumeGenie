// src/routes/api.js
const express = require('express');
const multer = require('multer');
const { generateUpdatedCV } = require('../controllers/cvController');
const { generatePDF } = require('../controllers/pdfController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// /api/cv/generate -> upload file -> generateUpdatedCV
router.post('/generate', upload.single('file'), generateUpdatedCV);

// /api/cv/generate-pdf -> generatePDF
router.post('/generate-pdf', generatePDF);

module.exports = router;
