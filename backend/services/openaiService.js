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
            content: `You are an expert HTML and CSS developer. Generate a complete, standalone HTML document with embedded CSS that creates a professional and modern CV. The output must:

Be clean, well-structured, and semantically correct.
Use a minimalist design with clear sections for personal information, professional summary, work experience, education, skills, and optional categories like certifications or languages.
Include a professional color palette (black, white, gray, and one accent color).
Ensure consistent typography with web-safe fonts (e.g., Arial, Helvetica, or sans-serif).
Be fully responsive, adapting to both desktop and mobile devices.
Include semantic HTML tags and ensure accessibility (e.g., proper heading hierarchy, alt attributes for images).
Contain embedded CSS within the <style> tag.
Avoid any markdown formatting, unnecessary comments, or explanatory text.
The output should consist only of the HTML code. Do not include any comments, explanations, or additional notes. Generate production-ready code suitable for immediate use.` 
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