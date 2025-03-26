const Files = require('../Schema/Files');

const getFiles = async (req, res) => {
    try {
        const { username } = req.body; // Extract username from request body

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const files = await Files.findOne({ username });

        if (!files) {
            return res.status(404).json({ message: "No files found for this user" });
        }

        res.status(200).json(files.filenames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFiles };