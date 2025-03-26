const express = require('express');
const router = express.Router();
const { getFiles } = require('../Controllers/getFiles');
const { newFile } = require('../Controllers/newFile');
const { delFile } = require('../Controllers/delFile');

router.post('/getFilenames', getFiles);
router.post('/newFile', newFile);
router.post('/delFile', delFile);

module.exports = router;