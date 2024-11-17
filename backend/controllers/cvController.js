const db = require('../config/firebase').firestore();
const pdfService = require('../services/pdfService');
const axios = require('axios');

const MAX_CVS_PER_USER = 5;

const createCv = async (req, res) => {
  try {
    const { uid } = req.user;
    const cvData = req.body;

    // Verificăm limita de CV-uri
    const userCvs = await db.collection('cvs')
      .where('userId', '==', uid)
      .get();

    if (userCvs.size >= MAX_CVS_PER_USER) {
      return res.status(400).json({ 
        message: `Maximum number of CVs (${MAX_CVS_PER_USER}) reached`
      });
    }

    // Creăm documentul CV în Firestore
    const cvRef = await db.collection('cvs').add({
      userId: uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...cvData,
      status: 'processing'
    });

    // Generăm PDF-ul
    const pdfUrl = await pdfService.generatePdf(cvData, uid, cvRef.id);

    // Actualizăm documentul cu URL-ul PDF-ului
    await cvRef.update({
      pdfUrl,
      status: 'completed'
    });

    res.status(201).json({ 
      message: 'CV created successfully',
      cvId: cvRef.id,
      pdfUrl
    });
  } catch (error) {
    console.error('Error in createCv:', error);
    res.status(500).json({ 
      message: 'Error creating CV', 
      error: error.message 
    });
  }
};

const downloadCv = async (req, res) => {
    try {
      const { cvId } = req.params;
      const pdfUrl = req.query.url;
  
      // Descarcă PDF-ul de la Firebase Storage
      const response = await axios({
        method: 'get',
        url: pdfUrl,
        responseType: 'stream'
      });
  
      // Setăm header-ele pentru descărcare
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="cv-${cvId}.pdf"`);
  
      // Transmitem PDF-ul către client
      response.data.pipe(res);
    } catch (error) {
      console.error('Error downloading CV:', error);
      res.status(500).json({ message: 'Error downloading CV' });
    }
  };
  

module.exports = { createCv, downloadCv };