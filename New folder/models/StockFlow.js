const mongoose = require('mongoose');

const stockFlow = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    procurement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Procurements',
        default: null
    },
    provider: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    order: {
        type: String,
        default: null
    },
    operationType: {
        type: String,
        default: ''
    },
    initialQuantity: {
        type: String,
        default: '0'
    },
    quantity: {
        type: String,
        default: '0'
    },
    newQuantity: {
        type: String,
        default: '0'
    },
    amount: {
        type: String,
        default: '0'
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('StockFlow', stockFlow)