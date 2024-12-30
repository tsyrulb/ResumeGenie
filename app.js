// app.js
// 1) Import Node libraries:
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 2) Import your controllers:
const { generateGeminiPDF } = require('./src/controllers/geminiPdfController'); 
const { generateCoverLetterEndpoint } = require('./src/controllers/coverLetterController');

// 3) Import the router from api.js
const apiRoutes = require('./src/routes/api');

// 4) Create the Express app
const app = express();
app.use(cors());
app.use(express.json());

// 5) Mount the router at /api/cv
// Now routes in api.js (/generate, /generate-pdf) become /api/cv/generate, /api/cv/generate-pdf
app.use('/api/cv', apiRoutes);

// 6) Additional routes directly in app.js
app.post('/api/cv/generate-advanced', generateGeminiPDF);
app.post('/api/cv/generate-cover', upload.single('file'), generateCoverLetterEndpoint);

// 7) Start listening on your desired port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
