const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url, {
        dbName: 'pos_system',
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to database');
    }).catch((err) => {
        console.log(err)
    })
}

module.exports = connectDB