const mongoose = require('mongoose');

// const Unit = require('./Units');

const unitsSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
})

// unitsSchema.post('remove', function (doc){
//     Unit.remove({unitGroup: { $in: doc.id }})
// });

module.exports = mongoose.model('UnitGroup', unitsSchema);