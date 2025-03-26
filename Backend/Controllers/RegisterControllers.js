const User = require('../Schema/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Files = require('../Schema/Files');
const FileContent = require('../Schema/FileContent');

const Register = async (req, res) => {
    let { email, username, password } = req.body;
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        const user = new User({ email, username, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        const files = new Files({ username:user.username, filenames:["file1"] });
        await files.save();

        const fileContent = new FileContent({ username:user.username, filename:"file1", content:"" });
        await fileContent.save();

        res.status(200).json({token, message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { Register };