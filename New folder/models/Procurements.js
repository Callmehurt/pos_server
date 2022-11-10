const mongoose = require('mongoose');


const procurementSchema = new mongoose.Schema({
    name: {
        type: String
    },
    invoiceNumber: {
        type: String
    },
    deliveryDate: {
        type: String
    },
    invoiceDate: {
        type: String
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'stocked'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Providers'
    },
    products: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    purchaseValue: {
        type: String,
        default: '0'
    },
    saleValue: {
        type: String,
        default: '0'
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Procurements', procurementSchema)