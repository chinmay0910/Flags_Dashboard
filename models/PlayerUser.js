const mongoose = require('mongoose')
const { Schema } = mongoose;

const PlayerUserSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "PLAYER"
    }
})


module.exports = mongoose.model("PlayerUser",PlayerUserSchema);