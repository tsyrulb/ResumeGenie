// pdfService.js
const puppeteer = require('puppeteer');

/**
 * Converts an HTML string to a PDF using Puppeteer.
 * @param {string} htmlContent - The HTML/CSS code
 * @param {string} outputPath - Where to save the resulting PDF
 * @returns {Promise<string>} - Resolves to the output path
 */
async function htmlToPdf(htmlContent, outputPath = 'UpdatedCV.pdf') {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();

    // Set the HTML content directly
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate the PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });

    return outputPath;
  } finally {
    await browser.close();
  }
}

module.exports = { htmlToPdf };
