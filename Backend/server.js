const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connectDB.js');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

// Route imports
const fileSavingRouter = require('./Routes/fileSaving.js');
const Register = require('./Routes/Register.js');
const Login = require('./Routes/Login.js');
const VerifyToken = require('./Routes/VerifyToken.js');
const filenames = require('./Routes/fileNames.js');
const fileContent = require('./Routes/FileContent.js');
const Rooms = require('./Routes/Rooms.js');

// Routes
app.use('/fileSaving', fileSavingRouter);
app.use('/Auth', Register);
app.use('/Auth', Login);
app.use('/Auth', VerifyToken);
app.use('/fileNames', filenames);
app.use('/fileContent', fileContent);
app.use('/Rooms', Rooms);

// Start the server
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});