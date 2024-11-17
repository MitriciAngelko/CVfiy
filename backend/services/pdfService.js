const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const admin = require('../config/firebase');
const os = require('os');
const openAiService = require('./openaiService');

class PdfService {
  constructor() {
    this.storage = admin.storage();
    this.tempDir = os.tmpdir();
  }

  async generatePdf(cvData, userId, cvId) {
    try {
      console.log('Starting PDF generation process...');
      
      // Generăm HTML-ul folosind OpenAI
      console.log('Generating HTML with OpenAI...');
      const html = await openAiService.generateHtml(cvData);
      
      console.log('HTML generated successfully. Creating PDF...');
      const outputPath = path.join(this.tempDir, `${cvId}.pdf`);

      // Opțiuni pentru generarea PDF-ului
      const options = {
        format: 'A4',
        border: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        timeout: 30000
      };

      // Generăm PDF-ul din HTML
      await new Promise((resolve, reject) => {
        pdf.create(html, options).toFile(outputPath, (err, res) => {
          if (err) {
            console.error('Error creating PDF:', err);
            reject(err);
          } else {
            console.log('PDF created successfully:', res);
            resolve(res);
          }
        });
      });

      console.log('PDF generated. Uploading to Firebase Storage...');
      
      // Încărcăm în Firebase Storage
      const storagePath = `cvs/${userId}/${cvId}.pdf`;
      await this.storage.bucket().upload(outputPath, {
        destination: storagePath,
        metadata: {
          contentType: 'application/pdf',
          contentDisposition: 'attachment; filename="cv.pdf"'
        }
      });

      console.log('Upload successful. Generating download URL...');
      
      // Obținem URL-ul de download
      const [url] = await this.storage.bucket()
        .file(storagePath)
        .getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 zile
          responseDisposition: 'attachment; filename="cv.pdf"'
        });

      // Curățăm fișierul temporar
      fs.unlinkSync(outputPath);

      console.log('Process completed successfully');
      return url;
    } catch (error) {
      console.error('Error in PDF generation process:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }
}

module.exports = new PdfService();