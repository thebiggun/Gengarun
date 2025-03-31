const express = require('express');
const router = express.Router();
const creatingRoom = require('../Controllers/creatingNewRoom');
const joinRoom = require('../Controllers/joiningRoom');
const getRoomFiles = require('../Controllers/getRoomFiles');
const newRoomFile = require('../Controllers/newRoomFile');
const deleteRoomFile = require('../Controllers/delRoomFile');

router.get('/createRoom', creatingRoom);
router.post('/joinRoom', joinRoom);
router.post('/getRoomFiles', getRoomFiles);
router.post('/newRoomFile', newRoomFile);
router.post('/delRoomFile', deleteRoomFile);

module.exports = router;