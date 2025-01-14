// coverLetterController.js
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const puppeteer = require('puppeteer');
const { generateCoverLetter } = require('../../coverLetterService');

exports.generateCoverLetterEndpoint = async (req, res) => {
  try {
    if (!req.file || !req.body.jobDescription) {
      return res.status(400).json({ message: 'Missing PDF or jobDescription' });
    }

    const pdfFile = req.file;
    const jobDescription = req.body.jobDescription;

    // 1) Parse PDF text
    const pdfText = await parsePdfFile(pdfFile.path);

    // 2) Get cover letter HTML from your AI
    const coverLetterHTML = await generateCoverLetter(pdfText, jobDescription);
    if (!coverLetterHTML) {
      return res.status(500).json({ message: 'No cover letter HTML returned from AI' });
    }

    // 3) Launch Puppeteer to convert that HTML to PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    // Provide the AI's HTML to Puppeteer
    await page.setContent(coverLetterHTML, {
      waitUntil: 'domcontentloaded',
      timeout: 0
    });

    // Generate an in-memory PDF buffer (no file path)
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '0.2in', right: '0.2in', bottom: '0.2in', left: '0.2in' },
      printBackground: true,
    });

    await browser.close();

    // 4) Return PDF binary to the client
    res.setHeader('Content-Type', 'application/pdf');
    // (Optional) force download:
    // res.setHeader('Content-Disposition', 'attachment; filename="CoverLetter.pdf"');
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Error generating cover letter:', err);
    res.status(500).json({ message: 'Error generating cover letter', error: err.message });
  }
};

async function parsePdfFile(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
}
