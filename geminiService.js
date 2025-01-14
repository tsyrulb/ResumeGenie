// geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function generateHtmlFromGemini(fullText) {
  // 1) Build your prompt to parse raw text
  const promptText = `
    You are a creative resume/CV writer and designer.

    **Goal**: 
    - Produce a single-page CV layout (A4).

    **Instructions**:
    1. Use **HTML** with inline CSS; do NOT output triple backticks or markdown fences.
    2. The CV **must** fit on **one** A4 page, even if the user’s data is large. 
    3. Be creative in styling.

   **Output**:
    - A valid HTML document containing these sections. 
    - Do NOT produce code fences, triple backticks, or extra text beyond the raw HTML.

    Here is the user’s updated CV text:

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
