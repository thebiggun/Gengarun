const Rooms = require('../Schema/Rooms');

const joinRoom = async (req, res) => {
    try {
        const { roomID } = req.body;

        const room = await Rooms.findOne({ roomID });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ message: "Joined room successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = joinRoom;