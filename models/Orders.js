const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        default: ''
    },
    tableNumber: {
        type: mongoose.Types.ObjectId,
        ref: 'Tables',
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
        enum: ['ongoing', 'complete'],
        default: 'ongoing'
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
        type: String,
        default: '0'
    },
    total: {
        type: String,
        default: '0'
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
    orderedProducts: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
});

module.exports = mongoose.model('Orders', orderSchema);