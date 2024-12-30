// coverLetterController.js
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const puppeteer = require('puppeteer');
const { generateCoverLetter } = require('../../coverLetterService'); 
// e.g. you have a function that returns the AI's cover letter in HTML form

exports.generateCoverLetterEndpoint = async (req, res) => {
  try {
    // 1) Validate input
    if (!req.file || !req.body.jobDescription) {
      return res.status(400).json({ message: 'Missing PDF or jobDescription' });
    }
    const pdfFile = req.file;
    const jobDescription = req.body.jobDescription;

    // 2) Parse the PDF to extract text
    const pdfText = await parsePdfFile(pdfFile.path);

    // 3) Generate cover letter HTML from PDF text + job desc
    const coverLetterHTML = await generateCoverLetter(pdfText, jobDescription);
    if (!coverLetterHTML) {
      return res.status(500).json({ message: 'No cover letter HTML returned from AI' });
    }

    // 4) Convert that HTML to PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.setContent(coverLetterHTML, {
      waitUntil: 'domcontentloaded',
      timeout: 0
    });

    // Create a PDF in memory (no path), so we can stream it back
    const pdfBuffer = await page.pdf({
      format: 'A4',
      scale: 0.9,
      margin: { top: '0.2in', right: '0.2in', bottom: '0.2in', left: '0.2in' },
      printBackground: true
    });

    await browser.close();

    // 5) Send the PDF as a binary response
    res.setHeader('Content-Type', 'application/pdf');
    // If you want a download prompt:
    // res.setHeader('Content-Disposition', 'attachment; filename="CoverLetter.pdf"');

    // Finally send the PDF buffer
    return res.send(pdfBuffer);

  } catch (err) {
    console.error('Error generating cover letter:', err);
    res.status(500).json({ message: 'Error generating cover letter', error: err.message });
  }
};

// Helper: parse the PDF text
async function parsePdfFile(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
}
