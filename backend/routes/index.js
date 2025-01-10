const express = require('express');
const userRoutes = require('./userRoutes');
const cvRoutes = require('./cvRoutes');
const messageRoutes = require('./messageRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/cvs', cvRoutes);
router.use('/messages', messageRoutes);

module.exports = router;