const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/authMiddleware');

router.get('/verifyToken', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.user });
});

module.exports = router;