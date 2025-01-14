// src/utils/pdfGenerator.js
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// 1) Converts CV text -> PDF file (returns the path)
async function convertCVToPDF(cvContent, fileName = "UpdatedCV.pdf") {
  const docHtml = `
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: sans-serif;
      margin: 1in;
      font-size: 14px;         /* add a base font size here */
      line-height: 1.4;        /* optional for better readability */
    }
    pre {
      font-size: 14px;         /* ensure <pre> text also inherits or sets a size */
      line-height: 1.3;        /* slightly different line-height in <pre>? */
    }
  </style>
</head>
<body>
  <pre>${cvContent}</pre>
</body>
</html>`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(docHtml, { waitUntil: "domcontentloaded" });

  const outputDir = path.join(__dirname, "../outputs");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, fileName);

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
  });
  await browser.close();

  return outputPath;
}

// 2) Converts cover letter text -> PDF Buffer (no file path)
async function convertTextToPDF(coverLetterText) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Simple HTML structure for the cover letter
  const htmlContent = `
  <html>
  <head>
    <meta charset="UTF-8">
    <style> body { font-family: sans-serif; margin: 1in; } </style>
  </head>
  <body>
    <p>${coverLetterText.replace(/\n/g, "<br>")}</p>
  </body>
  </html>`;

  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return pdfBuffer;
}

module.exports = {
  convertCVToPDF,
  convertTextToPDF,
};
