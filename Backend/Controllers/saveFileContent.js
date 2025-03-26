const FileContent = require('../Schema/FileContent');

const saveFileContent = async (req, res) => {
    try {
        const { username, filename, text } = req.body;

        const fileContent = await FileContent.findOne({ username, filename });

        if (fileContent) {
            fileContent.content = text;
            await fileContent.save();
            return res.status(200).json({ message: "File content updated" });
        }

        return res.status(500).json({ message: "File content not found" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = saveFileContent;