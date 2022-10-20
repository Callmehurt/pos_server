const Product = require('../../models/Product');
const StockFlow = require('../../models/StockFlow');
const mongoose = require('mongoose');

exports.get_searched_products = async (req, res) => {
    try{
        const {productName} = req.query;
        const searchedProducts = await Product.find({"name": { $regex: new RegExp("^" + productName.toLowerCase(), "i") },  "stockManagement": true}, {
                returnOriginal: false
            }).populate([
                {
                  strictPopulate: false,
                  path: 'category',
                  select: 'name'
                },
                {
                  strictPopulate: false,
                  path: 'thumbnail',
                  select: 'image'
                },
                {
                 strictPopulate: false,
                 path: 'unitGroup',
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


exports.adjust_stock = async (req, res) => {
    try {
        const adjustedProducts = req.body.adjustedProducts;
        await Promise.all(
            adjustedProducts.map(async (product) => {
                const action = product?.stockAction ? product.stockAction : 'add';
                const changedQuantity = product?.changedQuantity ? product.changedQuantity : 1;
                let newQuantity = '';
                if(action === 'add'){
                    newQuantity = parseInt(product.onStock) + parseInt(changedQuantity);
                }else if (action === 'deduct' || action === 'defective' || action === 'lost'){
                    if(parseInt(product.onStock) > parseInt(changedQuantity)){
                        newQuantity = parseInt(product.onStock) - parseInt(changedQuantity);
                    }
                }

                const record = new StockFlow({
                    _id: new mongoose.Types.ObjectId(),
                    product: product._id,
                    operationType: action,
                    initialQuantity: product.onStock,
                    quantity: product?.changedQuantity ? product.changedQuantity : 1,
                    amount: parseInt(changedQuantity)*parseInt(product.salePrice),
                    newQuantity: newQuantity
                });
                if(action === 'add'){
                    await Product.findByIdAndUpdate(product._id, {onStock: parseInt(product.onStock)+parseInt(changedQuantity)});
                }else if (action === 'deduct' || action === 'defective' || action === 'lost'){
                    if(parseInt(product.onStock) < parseInt(changedQuantity)){
                        res.status(500).json({
                            message: 'Current stock is less'
                        })
                    }else {
                        await Product.findByIdAndUpdate(product._id, {onStock: parseInt(product.onStock)-parseInt(changedQuantity)});
                    }
                }
                await record.save();
            })
        )

        res.status(200).json({
            dta: adjustedProducts,
            message: 'Stock adjusted successfully'
        })

    }catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

exports.delete_stock_flow_record = async (req, res) => {
    try {
        const recordId = req.params.recordId;

        const record = await StockFlow.findById(recordId);

        if(!record){
            return res.status(500).json({
                message: 'Record not found'
            })
        }

        await record.deleteOne();

        res.status(200).json({
            message: 'Record deleted successfully'
        })

    }catch (e) {
        return res.status(500).json(e);
    }
}

exports.fetch_stock_flow = async (req, res) => {
    try{

        const result = await StockFlow.find({}).populate([
                {
                  strictPopulate: false,
                  path: 'product',
                  select: 'name',
                  populate: ([
                      {
                          strictPopulate: false,
                          path: 'assignedUnit',
                          select: ['name', 'identifier']
                      }
                  ])
                },
                {
                  strictPopulate: false,
                  path: 'procurement',
                  select: ['name']
               }
            ]).sort({createdAt: -1});

        res.status(200).json(result);

    }catch (e){
        console.log(e);
        return res.status(500).json(e)
    }
}