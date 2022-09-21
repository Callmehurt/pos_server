const mongoose = require('mongoose');


const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    identifier: {
        type: String,
        unique: true,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    unitGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnitGroup'
    }
}, {
    timeStamp: true
})

module.exports = mongoose.model('Units', unitSchema);