const Rooms = require('../Schema/Rooms');

const getRoomFiles = async (req, res) => {
    const { roomID } = req.body;

    try {
        const room = await Rooms.findOne({ roomID });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json(room.roomFiles);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = getRoomFiles;