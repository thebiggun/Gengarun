const mongoose = require('mongoose');

const fileContentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    content: {
        type: String
    }
});

module.exports = mongoose.model('FileContent', fileContentSchema);