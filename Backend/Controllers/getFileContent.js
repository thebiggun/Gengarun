const FileContent = require('../Schema/FileContent');

const getFileContent = async (req, res) => {
    try {
        const { username, filename } = req.body;

        const fileContent = await FileContent.findOne({ username, filename });

        if (!fileContent) {
            return res.status(404).json({ message: "File not found" });
        }

        res.status(200).json({ content: fileContent.content
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports =  getFileContent ;