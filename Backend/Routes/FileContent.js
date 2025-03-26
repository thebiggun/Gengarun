const express = require('express');
const router = express.Router();
const getFileContent = require('../Controllers/getFileContent');
const saveFileContent = require('../Controllers/saveFileContent');

router.post('/getFileContent', getFileContent);
router.post('/saveFileContent', saveFileContent);

module.exports = router;