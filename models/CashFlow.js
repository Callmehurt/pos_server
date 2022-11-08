const mongoose = require('mongoose');

const cashFlowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: 0
    },
    operation: {
        type: String,
        enum: ['debit', 'credit'],
        default: 'debit'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('CashFlow', cashFlowSchema);

