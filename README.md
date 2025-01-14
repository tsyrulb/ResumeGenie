
# ResumeGenie

**ResumeGenie** is a Node.js and Express backend server that leverages Google's Gemini AI to automate the creation and customization of professional CVs and cover letters. It processes uploaded CVs and job descriptions to generate tailored documents in PDF format, streamlining the job application process.

## Features

- **PDF Parsing**: Extract text from uploaded CV PDFs using `pdf-parse`.
- **AI-Powered Generation**: Create customized CVs and cover letters with Google's Gemini AI.
- **HTML to PDF Conversion**: Convert generated HTML content into downloadable PDFs using Puppeteer.
- **File Handling**: Manage file uploads securely with Multer.
- **API Endpoints**: Provide RESTful APIs for frontend integration.

## Technologies Used

- **Node.js**
- **Express**
- **Multer**
- **pdf-parse**
- **Puppeteer**
- **Google Generative AI (Gemini)**
- **dotenv**

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/tsyrulb/ResumeGenie.git
   cd ResumeGenie
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory:

   ```bash
   touch .env
   ```

   Add the following to `.env`:

   ```env
   PORT=5000
   GOOGLE_API_KEY=your_google_api_key_here
   ```

   > **Note**: Replace `your_google_api_key_here` with your actual Google API key. Ensure `.env` is added to `.gitignore` to keep it secure.

## Usage

1. **Start the Server**

   ```bash
   node app.js
   ```

   The server will run on [http://localhost:5000](http://localhost:5000).

2. **API Endpoints**

   - **Generate Advanced CV**

     - **Endpoint**: `/api/cv/generate-advanced`
     - **Method**: `POST`
     - **Description**: Generates an advanced CV in PDF format based on raw text input.
     - **Request Body**:

       ```json
       {
         "fullText": "Your CV text here..."
       }
       ```

     - **Response**: Downloads `AI_CV.pdf`.

   - **Generate Cover Letter**

     - **Endpoint**: `/api/cv/generate-cover`
     - **Method**: `POST`
     - **Description**: Creates a tailored cover letter PDF based on an uploaded CV and job description.
     - **Request**:
       - **Content-Type**: `multipart/form-data`
       - **Form Data**:
         - `file`: PDF file of the existing CV.
         - `jobDescription`: Text describing the job role.
     - **Response**: Downloads `CoverLetter.pdf`.

   - **Generate Updated CV**

     - **Endpoint**: `/api/cv/generate`
     - **Method**: `POST`
     - **Description**: Generates an updated CV text based on an uploaded PDF and job description.
     - **Request**:
       - **Content-Type**: `multipart/form-data`
       - **Form Data**:
         - `file`: PDF file of the existing CV.
         - `jobDescription`: Text describing the job role.
     - **Response**:

       ```json
       {
         "updatedCV": "Your updated CV text here..."
       }
       ```

   - **Generate PDF from Text**

     - **Endpoint**: `/api/cv/generate-pdf`
     - **Method**: `POST`
     - **Description**: Converts provided text into a PDF file.
     - **Request Body**:

       ```json
       {
         "finalCV": "Your final CV text here..."
       }
       ```

     - **Response**: Downloads `UpdatedCV-<timestamp>.pdf`.


## License

This project is licensed under the [MIT License](LICENSE).
