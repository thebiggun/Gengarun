const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connectDB.js');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

// Track locks and timeouts for each room
const roomLocks = {};
const lockTimeouts = {};

io.on('connection', (socket) => {
    console.log("A user connected: ", socket.id);

    socket.on('joinRoom', ({ roomID, filename }) => {
        const roomName = `${roomID}-${filename}`;
        socket.join(roomName);
        console.log(`User with ID: ${socket.id} joined room: ${roomName}`);
    });

    socket.on('lockUpdate', ({ roomID, filename, lockedBy }) => {
        const roomName = `${roomID}-${filename}`;

        // Check if the room is already locked
        if (roomLocks[roomName] && roomLocks[roomName] !== socket.id) {
            // Notify the user that the room is locked by someone else
            socket.emit('lockDenied', { lockedBy: roomLocks[roomName] });
        } else {
            // Lock the room for this user
            roomLocks[roomName] = socket.id;
            io.to(roomName).emit('lockUpdate', { lockedBy: socket.id }); // Notify all users in the room

            // Clear any existing timeout for this room
            if (lockTimeouts[roomName]) {
                clearTimeout(lockTimeouts[roomName]);
            }

            // Set a timeout to release the lock after inactivity
            lockTimeouts[roomName] = setTimeout(() => {
                if (roomLocks[roomName] === socket.id) {
                    delete roomLocks[roomName];
                    io.to(roomName).emit('releaseLock'); // Notify all users in the room
                }
            }, 5000); // 5 seconds of inactivity
        }
    });

    socket.on('releaseLock', ({ roomID, filename }) => {
        const roomName = `${roomID}-${filename}`;

        // Release the lock if the user holding it disconnects or stops typing
        if (roomLocks[roomName] === socket.id) {
            delete roomLocks[roomName];
            io.to(roomName).emit('releaseLock'); // Notify all users in the room

            // Clear the timeout for this room
            if (lockTimeouts[roomName]) {
                clearTimeout(lockTimeouts[roomName]);
                delete lockTimeouts[roomName];
            }
        }
    });

    socket.on('fileUpdate', ({ roomID, filename, content }) => {
        const roomName = `${roomID}-${filename}`;
        socket.to(roomName).emit('fileUpdate', content); // Broadcast to others in the room

        // Reset the timeout for the lock
        if (roomLocks[roomName] === socket.id) {
            if (lockTimeouts[roomName]) {
                clearTimeout(lockTimeouts[roomName]);
            }

            // Set a new timeout to release the lock after inactivity
            lockTimeouts[roomName] = setTimeout(() => {
                if (roomLocks[roomName] === socket.id) {
                    delete roomLocks[roomName];
                    io.to(roomName).emit('releaseLock'); // Notify all users in the room
                }
            }, 3000); // Reduced to 3 seconds of inactivity
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);

        // Release locks held by the disconnected user
        for (const roomName in roomLocks) {
            if (roomLocks[roomName] === socket.id) {
                delete roomLocks[roomName];
                io.to(roomName).emit('releaseLock'); // Notify all users in the room

                // Clear the timeout for this room
                if (lockTimeouts[roomName]) {
                    clearTimeout(lockTimeouts[roomName]);
                    delete lockTimeouts[roomName];
                }
            }
        }
    });
});

// Routes
const fileSavingRouter = require('./Routes/fileSaving.js');
const Register = require('./Routes/Register.js');
const Login = require('./Routes/Login.js');
const VerifyToken = require('./Routes/VerifyToken.js');
const filenames = require('./Routes/fileNames.js');
const fileContent = require('./Routes/FileContent.js');
const Rooms = require('./Routes/Rooms.js');

app.use('/fileSaving', fileSavingRouter);
app.use('/Auth', Register);
app.use('/Auth', Login);
app.use('/Auth', VerifyToken);
app.use('/fileNames', filenames);
app.use('/fileContent', fileContent);
app.use('/Rooms', Rooms);

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});