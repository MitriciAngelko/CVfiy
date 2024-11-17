const OpenAI = require('openai');

class OpenAiService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateHtml(cvData) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a HTML expert. Generate clean, well-structured HTML for CVs.
            Include embedded CSS for styling. Use modern, professional design.
            Return only the HTML code without any markdown formatting or code blocks.
            Use web-safe fonts and simple CSS.`
          },
          {
            role: "user",
            content: `Create a CV HTML with this data: ${JSON.stringify(cvData, null, 2)}.`
          }
        ]
      });

      let htmlCode = completion.choices[0].message.content;
      
      // Curățăm codul în caz că GPT adaugă markdown
      htmlCode = htmlCode.replace(/```html\n?/g, '');
      htmlCode = htmlCode.replace(/```\n?/g, '');
      
      // Ne asigurăm că avem un document HTML complet
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