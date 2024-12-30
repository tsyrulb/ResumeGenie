// geminiPdfController.js
const { generateHtmlFromGemini } = require('../../geminiService');
const puppeteer = require('puppeteer');
const path = require('path');

/**
 * Expects: { fullText: string } in the request body
 */
exports.generateGeminiPDF = async (req, res) => {
  try {
    const { fullText } = req.body;
    if (!fullText) {
      return res.status(400).json({ message: 'No text provided' });
    }

    // 1) Generate HTML from raw text
    const html = await generateHtmlFromGemini(fullText);
    if (!html) {
      return res.status(500).json({ message: 'No HTML returned from model' });
    }

    // 2) Convert HTML to PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Optional: set timeouts to 0 for slower environments
    page.setDefaultNavigationTimeout(0);

    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
      timeout: 0
    });

    const outputPath = path.join(__dirname, '../outputs/AdvancedCV.pdf');
    await page.pdf({
      path: outputPath,
      format: 'A4',
      scale: 0.9,
      margin: { top: '0.2in', right: '0.2in', bottom: '0.2in', left: '0.2in' },
      printBackground: true,
    });

    await browser.close();

    // 3) Return PDF
    res.download(outputPath, 'AI_CV.pdf', err => {
      if (err) console.error('Error sending PDF:', err);
      // fs.unlinkSync(outputPath); // remove if needed
    });
  } catch (err) {
    console.error('Error generating Gemini PDF:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
};
