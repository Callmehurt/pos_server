const mongoose = require('mongoose');
const {Schema} = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    parent: Schema.Types.Mixed,
    media: Schema.Types.Mixed,
    totalItems: {
        type: Number,
        default: '0'
    }
},
    {
        timestamps: true
    })


module.exports = mongoose.model('Category', categorySchema);