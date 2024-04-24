const mongoose = require('mongoose');

// Define the team schema
const flagSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    ctfdChallenge: {
        type: String,
        required: true
    },
    ctfdFlag: {
        type: String,
        required: true
    },
    encryptedFlag: {
        type: String,
        required: true
    }
});

// Create the Team model
const Flag = mongoose.model('flags', flagSchema);

module.exports = Flag;
