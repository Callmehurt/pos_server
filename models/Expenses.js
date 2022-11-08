const mongoose = require('mongoose');


const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    value: {
        type: Number,
        default: 0
    }
},{
    timestamps: true,
})


module.exports = mongoose.model('Expenses', expenseSchema);