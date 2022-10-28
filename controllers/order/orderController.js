const Orders = require('../../models/Orders');
const Product = require('../../models/Product')

exports.search_products = async (req, res) => {
    try{
        const {productName} = req.query;
        const searchedProducts = await Product.find({"name": { $regex: new RegExp("^" + productName.toLowerCase(), "i") },  "onPos": true}, {
                returnOriginal: false
            }).populate([
                {
                  strictPopulate: false,
                  path: 'category',
                  select: 'name'
                },
                {
                 strictPopulate: false,
                 path: 'assignedUnit',
                 select: ['name', 'identifier']
                },
            ]);

        res.status(200).json(searchedProducts);
    }catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

exports.fetchOngoingOrders = async (req, res) => {
    try{

        const data = await Orders.find({orderStatus: 'ongoing'}).populate({
             strictPopulate: false,
            path: 'tableNumber',
            select: 'tableNumber'
        });

        res.status(200).json(data)

    }catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}