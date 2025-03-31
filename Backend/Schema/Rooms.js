const Mongoose = require('mongoose');

const RoomSchema = new Mongoose.Schema({
    roomID: {
        type: String,
        required: true
    },
    roomFiles: {
        type: Array,
        required: true
    }
});

module.exports = Mongoose.model('Rooms', RoomSchema);