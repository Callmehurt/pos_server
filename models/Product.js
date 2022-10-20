const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        default: null
    },
    sku: {
        type: String
    },
    stockManagement: {
        type: Boolean,
        default: true
    },
    onPos: {
        type: Boolean,
        default: true
    },
    unitGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnitGroup'
    },
    assignedUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Units'
    },
    salePrice: {
        type: Number
    },
    lowQuantity: {
        type: Number
    },
    productExpires: {
        type: Boolean,
        default: false
    },
    onExpiration: {
        type: String,
        enum: ['prevent_sale', 'allow_sale'],
        default: 'prevent_sale'
    },
    onStock: {
        type: String,
        default: '1'
    }
},
    {
        timestamps: true
    })


module.exports = mongoose.model('Product', productSchema)