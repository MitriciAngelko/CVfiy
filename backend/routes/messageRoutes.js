const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { sendMessage, startNewSession } = require('../controllers/messageController');
const router = express.Router();

router.post('/session/start', verifyToken, startNewSession);
router.post('/send', verifyToken, sendMessage);

module.exports = router;