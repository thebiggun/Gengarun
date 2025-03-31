const Rooms = require('../Schema/Rooms');
const FileContent = require('../Schema/FileContent'); // Correct model name

const newRoomFile = async (req, res) => {
    try {
        const { roomID } = req.body;

        const room = await Rooms.findOne({ roomID });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.roomFiles.length === 0) {
            const newFileName = "file1";
            room.roomFiles.push(newFileName);
            await room.save();

            const fileContent = new FileContent({ username: roomID, filename: newFileName, content: "" });
            await fileContent.save();

            return res.status(200).json({ files: newFileName });
        }

        const lastFile = room.roomFiles[room.roomFiles.length - 1];
        const match = lastFile.match(/file(\d+)/);

        if (!match) {
            return res.status(400).json({ message: "Invalid file naming convention" });
        }

        const newName = "file" + (parseInt(match[1]) + 1);

        room.roomFiles.push(newName);
        await room.save();

        const fileContent = new FileContent({ username: roomID, filename: newName, content: "" });
        await fileContent.save();

        res.status(200).json({ files: newName });
    } catch (error) {
        console.error("Error in newRoomFile:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = newRoomFile;