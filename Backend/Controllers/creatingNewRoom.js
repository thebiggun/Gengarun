const Rooms = require('../Schema/Rooms');
const FileContent = require('../Schema/FileContent');

const createNewRoom = async (req, res) => {
    const roomID = Math.floor(1000 + Math.random() * 9000);
    const roomFiles = ["file1"];
    const newRoom = new Rooms({ roomID, roomFiles });
    await newRoom.save();
    const newFileContent = new FileContent({ username: roomID, filename: "file1", content: "" });
    await newFileContent.save();
    res.status(200).json({ roomID });
}

module.exports = createNewRoom;