// src/controllers/pdfController.js
const { convertCVToPDF } = require('../utils/pdfGenerator');

exports.generatePDF = async (req, res) => {
  try {
    const { finalCV } = req.body;
    if (!finalCV) {
      return res.status(400).json({ message: 'No final CV text provided.' });
    }

    // Convert text -> PDF (writes a file, returns path)
    const pdfPath = await convertCVToPDF(finalCV, `UpdatedCV-${Date.now()}.pdf`);

    // Return PDF as a file download
    res.download(pdfPath);
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
};
