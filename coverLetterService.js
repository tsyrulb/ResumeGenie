// coverLetterService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function generateCoverLetter(pdfText, jobDescription) {
  const prompt = `
    You are a professional cover letter writer. You will be given:

1) The user’s CV text, containing background and skills.
2) The job description or role details (possibly referencing the target company or position).

**Task**:
- Produce a short, professional cover letter in **valid HTML** (no triple backticks, no Markdown fences).
- The cover letter should include common fields like:
  [Date], [Hiring Manager Name or Title], [Company/Address], and a greeting like “Dear [Hiring Manager Name],” if known.
- If the hiring manager name is **not** specified, use a generic title like “Dear Hiring Manager,”.
- Focus on key points from the user’s CV that match the job description.

**Output Requirements**:
- Provide **only** an HTML document with minimal inline CSS. 
- Use HTML tags for structure.
- Inside the cover letter, fill placeholders for:
  [Date]
  [Hiring Manager Name]
  [Company Address or Name]
(if you can't - just don't write them, becouse I can not make changes to Cover Letter)
- Summarize the user’s relevant experience, highlight the match to the job, and end with a polite sign-off (e.g., “Sincerely, [User’s Name]”).

Now, here is the user’s CV text:
-----------------------
${pdfText}
-----------------------

And here is the job description:
-----------------------
${jobDescription}
-----------------------

**Again, produce only valid HTML, no code fences, including placeholders like [Date], [Hiring Manager Name], and so on.**

  `;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // If you have Gemini access, use it; otherwise try "text-bison-001"
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 2) Generate content
  const resp = await model.generateContent(prompt);

  // Check how the library returns text. Possibly:
  const rawOutput = await resp.response.text();

  console.log(rawOutput);

  return rawOutput || "";
}

module.exports = { generateCoverLetter };
