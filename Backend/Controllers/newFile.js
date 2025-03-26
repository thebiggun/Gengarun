const Files = require("../Schema/Files");
const FileContent = require("../Schema/FileContent");

const newFile = async (req, res) => {
    try {
        const { username } = req.body;
        
        const file = await Files.findOne({ username });

        if (!file) {
            return res.status(404).json({ message: "User not found" });
        }
        if(file.filenames.length === 0){
            file.filenames.push("file1");
            await file.save();
            const fileContent = new FileContent({ username, filename: "file1", content: "" });
            await fileContent.save();
            return res.status(200).json({ files: "file1" });
        }
        const lastFile = file.filenames[file.filenames.length - 1];
        const match = lastFile.match(/file(\d+)/);

        let newName = "file"+(parseInt(match[1])+1);

        file.filenames.push(newName);
        await file.save();

        const fileContent = new FileContent({ username, filename: newName, content: "" });
        await fileContent.save();

        res.status(200).json({ files: newName });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { newFile };