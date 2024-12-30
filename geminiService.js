// geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function generateHtmlFromGemini(fullText) {
  // 1) Build your prompt to parse raw text
  const promptText = `
    You are a professional resume/CV designer. You will be given an updated CV as raw text.
    Output a valid HTML—no triple backticks (with minimal inline CSS) that is creative and concise enough to fit on **one printed page** (A4).

    Here is the updated CV text:

    -----------------------
    ${fullText}
    -----------------------
  `;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // If you have Gemini access, use it; otherwise try "text-bison-001"
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 2) Generate content
  const resp = await model.generateContent(promptText);

  // Check how the library returns text. Possibly:
  const rawOutput = await resp.response.text();
  // If it has triple backticks, remove them:
  let processed = rawOutput.replace(/```/g, '').trim();
  const html = processed.replace(/^html\s*(\r?\n)?/i, '');

  return html;
}

module.exports = { generateHtmlFromGemini };
