import google.generativeai as genai
import os
import sys
import json 
from dotenv import load_dotenv
load_dotenv()

def extract_summary(cv_content):
    """Extract the Summary section from the CV."""
    lines = cv_content.splitlines()
    summary = []
    inside_summary = False

    for line in lines:
        if "SUMMARY" in line.upper():
            inside_summary = True
            continue
        if inside_summary:
            if line.strip() == "" or line.isupper():  # Stop at the next section
                break
            summary.append(line.strip())

    return " ".join(summary)

def replace_summary(cv_content, new_summary):
    """Replace the Summary section in the CV with the new summary."""
    lines = cv_content.splitlines()
    updated_cv = []
    inside_summary = False

    for line in lines:
        if "SUMMARY" in line.upper():
            updated_cv.append(line)  # Keep the "Summary" header
            updated_cv.append(new_summary)  # Add the new summary
            inside_summary = True
            continue
        if inside_summary:
            if line.strip() == "" or line.isupper():  # Stop replacing at the next section
                inside_summary = False
        if not inside_summary:
            updated_cv.append(line)

    return "\n".join(updated_cv)

def main():
    # Configure the API key
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("API key not found in environment variables")

    genai.configure(api_key=api_key)

    # Ensure enough arguments are provided
    if len(sys.argv) < 3:
        raise IndexError("Insufficient arguments provided to the script. Expecting CV content and job description.")

    # Decode JSON-encoded CV content and job description
    cv_content = json.loads(sys.argv[1])
    job_description = json.loads(sys.argv[2])

    # Extract the current summary
    current_summary = extract_summary(cv_content)
    if not current_summary:
        current_summary = "No summary found. Create a new summary based on the job description."

    # Initialize the Gemini model
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Generate the new summary using the entire CV and job description
    prompt = f"""
    You are an expert resume writer. You are given:
    1) A user's current CV content,
    2) A target job description.

    **Task**:
    Rewrite ONLY the "Summary" section, ensuring that:
    - You only reference skills the user explicitly has in their CV.
    - If the job description lists skills that are NOT in the user's CV, mention that the user is eager to learn them (do not claim the user already has them).
    - Keep it short, honest, and relevant to the role.

    Job Description:
    {job_description}

    User's CV:
    {cv_content}

    Now produce the updated "Summary" section:
    """
    response = model.generate_content(prompt)
    new_summary = response.text.strip()

    # Replace the summary in the CV
    updated_cv = replace_summary(cv_content, new_summary)

    # Output the updated CV
    print(updated_cv)

if __name__ == "__main__":
    main()
