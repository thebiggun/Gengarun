const Files = require("../Schema/Files");
const FileContent = require("../Schema/FileContent");

const delFile = async (req, res) => {
    try {
        const { username, filename } = req.body;
        const file = await Files.findOne({ username });
        if (!file) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = file.filenames.indexOf(filename);

        if (index === -1) {
            return res.status(404).json({ message: "File not found" });
        }

        file.filenames.splice(index, 1);
        await file.save();

        await FileContent.deleteOne({ username, filename });

        res.status(200).json({ message: file.filenames });

    }catch (error) {
            res.status(500).json({ message: error.message });
        }
}

module.exports = { delFile };