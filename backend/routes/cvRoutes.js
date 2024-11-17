const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { createCv, downloadCv } = require('../controllers/cvController');
const router = express.Router();

router.post('/create', verifyToken, createCv);
router.get('/download/:cvId', verifyToken, downloadCv);

module.exports = router;
