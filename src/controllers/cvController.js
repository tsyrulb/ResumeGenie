// controllers/cvController.js

const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { execFile } = require('child_process');

exports.generateUpdatedCV = async (req, res) => {
  const { jobDescription } = req.body;

  if (!req.file || !jobDescription) {
    return res.status(400).json({ message: 'PDF and job description are required' });
  }

  const filePath = req.file.path;

  try {
    // 1. Read PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const cvContent = pdfData.text;
    // 2. Exec Python to get updated CV (text)
    const pythonPath = path.resolve('./env/Scripts/python.exe');
    const formattedCvContent = JSON.stringify(cvContent);
    const formattedJobDescription = JSON.stringify(jobDescription);

    execFile(
      pythonPath,
      ['src/utils/generate.py', formattedCvContent, formattedJobDescription],
      (error, stdout, stderr) => {
        // Clean up PDF file
        fs.unlinkSync(filePath);

        if (error) {
          console.error(stderr);
          return res.status(500).json({ message: 'Error processing request', error: error.message });
        }

        const updatedCV = stdout.trim();
        // 3. Return updated CV as JSON
        res.status(200).json({ updatedCV });
      }
    );
  } catch (error) {
    fs.unlinkSync(filePath);
    res.status(500).json({ message: 'Error reading PDF', error: error.message });
  }
};
