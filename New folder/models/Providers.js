const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    amountDue: {
        type: String,
        default: '0'
    },
    amountPaid: {
        type: String,
        default: '0'
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Providers', providerSchema)