const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        default: ''
    },
    tableSpace: {
        type: Number,
        default: '1'
    },
    status: {
        type: String,
        enum: ['occupied', 'vacant'],
        default: 'vacant'
    }
}, {
    timestamps: true
});

tableSchema.post('deleteOne', async (callback) => {
    // this.model('Answers').remove({ Question_Id: this._id }, callback);
})

module.exports = mongoose.model('Tables', tableSchema)