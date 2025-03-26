const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    filenames: {
        type: Array,
        required: true,
    }
});

const Files = mongoose.model('Files', FileSchema);

module.exports = Files;