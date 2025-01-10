const OpenAI = require('openai');

class OpenAiService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateHtml(cvData) {
    console.log("Cv data ", cvData);
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional HTML and CSS developer specializing in designing modern, high-quality CVs. 
            Generate clean, well-structured, and semantically correct HTML and CSS code for CVs with a focus on:
            - A clean and modern layout with proper use of whitespace.
            - A professional color palette, e.g., black, white, gray, and one accent color.
            - Clear section separation for personal information, work experience, education, skills, and other relevant categories.
            - Consistent font sizes and weights for headers, subheaders, and body text.
            - Web-safe fonts (e.g., Arial, Helvetica, or sans-serif) and simple CSS for styling.
            - Responsive design suitable for both desktop and mobile viewing.
            - Proper accessibility standards (e.g., semantic tags, alt attributes for images if needed).
            - Avoidance of overly complex or flashy designs; prioritize readability and professionalism.

            Include embedded CSS within the HTML file. Ensure that the HTML output is a complete, standalone document and includes <!DOCTYPE html>, <html>, <head>, and <body> tags.

            Avoid adding any markdown formatting or unnecessary comments in the code. Your output should be production-ready.` 
          },
          {
            role: "user",
            content: `Create a CV HTML with this data: ${JSON.stringify(cvData, null, 2)}.`
          }
        ]
      });

      let htmlCode = completion.choices[0].message.content;
      
      htmlCode = htmlCode.replace(/```html\n?/g, '');
      htmlCode = htmlCode.replace(/```\n?/g, '');
      
      if (!htmlCode.includes('<!DOCTYPE html>')) {
        htmlCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
  </style>
</head>
<body>
${htmlCode}
</body>
</html>`;
      }

      return htmlCode;
    } catch (error) {
      console.error('Error generating HTML:', error);
      throw new Error('Failed to generate HTML code');
    }
  }
}

module.exports = new OpenAiService();