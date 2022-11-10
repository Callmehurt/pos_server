const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    image: {
        type: Buffer
    },
},
    {
        timestamps: true
    }
    );


module.exports = mongoose.model('Media', mediaSchema);