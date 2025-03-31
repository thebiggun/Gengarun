const Rooms = require('../Schema/Rooms');
const FileContent = require('../Schema/FileContent');

const delRoomFile = async (req, res) => {
    try {
        const { roomID, filename } = req.body;

        // Find the room by roomID
        const room = await Rooms.findOne({ roomID });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Check if the file exists in the roomFiles array
        const index = room.roomFiles.indexOf(filename);
        if (index === -1) {
            return res.status(404).json({ message: "File not found" });
        }

        // Remove the file from the roomFiles array
        room.roomFiles.splice(index, 1);
        await room.save();

        // Delete the file content associated with the roomID and filename
        await FileContent.deleteOne({ username: roomID, filename });

        res.status(200).json({ message: "File deleted successfully", roomFiles: room.roomFiles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = delRoomFile;