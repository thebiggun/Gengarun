const express = require('express');
const router = express.Router();

const { Login } = require('../Controllers/LoginController');

router.post('/login', Login);

module.exports = router;