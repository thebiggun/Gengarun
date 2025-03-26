const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const dotenv = require('dotenv');

const connectDB = require('./connectDB.js');

dotenv.config();

connectDB();

const fileSavingRouter = require('./Routes/fileSaving.js');
const Register = require('./Routes/Register.js');
const Login = require('./Routes/Login.js');
const VerifyToken = require('./Routes/VerifyToken.js');
const filenames = require('./Routes/fileNames.js');
const fileContent = require('./Routes/FileContent.js');

app.use(express.json());
app.use(cors({origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true}));

app.use('/fileSaving', fileSavingRouter);
app.use('/Auth', Register);
app.use('/Auth', Login);
app.use('/Auth', VerifyToken);
app.use('/fileNames', filenames);
app.use('/fileContent', fileContent);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
