const User = require('../Schema/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { Login };