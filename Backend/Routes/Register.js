const express = require('express');
const router = express.Router();

const { Register } = require('../Controllers/RegisterControllers');

router.post('/register', Register);

module.exports = router;