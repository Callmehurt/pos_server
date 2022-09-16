const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'staff',
        enum: ['staff', 'admin'],
        required: true,
    },
    refresh_token: {
        type: String,
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('User', userSchema);