const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    orderCode: {
        type: String,
        default: ''
    },
    orderType: {
        type: String,
        enum: ['takeaway', 'inhouse'],
        default: 'inhouse'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid', 'partial'],
        default: 'unpaid'
    },
    orderStatus: {
        type: String,
        enum: ['hold', 'complete'],
        default: 'hold'
    },
    discountType: {
        type: String,
        enum: ['percentage', 'flat'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    subTotal: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    reference: {
        type: String,
        default: ''
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'esewa', 'mobank'],
        default: 'cash'
    },
    partialPayment: {
        type: Boolean,
        default: false
    },
    partialPaidAmount: {
        type: Number,
        default: 0
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    changeAmount: {
        type: Number,
        default: 0
    },
    products: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Orders', orderSchema);