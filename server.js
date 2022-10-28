require('dotenv').config();


//async errors
require('express-async-errors');


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');


//Routes imports
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoute');
const unitRoutes = require('./routes/unitRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const providerRoutes = require('./routes/providerRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const connectDB = require('./db/connect');

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');


app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

app.use(credentials);
app.use(cors(corsOptions));

//middleware for cookies
app.use(cookieParser());

// app.use(express.static(__dirname + '/public'));


//Routes
app.get('/', (req, res) => {
    res.send('<h1>Hello backend</h1>')
})

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', mediaRoutes);
app.use('/api/v1/admin', unitRoutes);
app.use('/api/v1/admin', categoryRoutes);
app.use('/api/v1/admin', productRoutes);
app.use('/api/v1/admin', providerRoutes);
app.use('/api/v1/admin', procurementRoutes);
app.use('/api/v1/admin', tableRoutes);

app.use('/api/v1/', orderRoutes);


//middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 4000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Listening to port ${port}...`))
    }catch (e){
        console.log(e)
    }
}


start();