const Product = require('../../models/Product');
const mongoose = require('mongoose');


exports.create_product = async (req, res) => {
    try{
        const prevData = await Product.findOne({"name": { $regex: new RegExp("^" + req.body.name.toLowerCase(), "i") } }).exec();
        if(prevData){
            return res.status(500).json({
                message: 'Product already exist'
            })
        }

        const newProduct = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            category: req.body.category,
            thumbnail: req.body.thumbnail,
            stockManagement: req.body.stockManagement,
            onPos: req.body.onPos,
            unitGroup: req.body.unitGroup,
            onExpiration: req.body.onExpiration,
            assignedUnit: req.body.assignedUnit,
            salePrice: req.body.salePrice,
            lowQuantity: req.body.lowQuantity,
        });

        try {
            await newProduct.save();
            const result = await newProduct.populate([
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
            ])
            res.status(200).json({
                message: 'Product added successfully',
                product: result
            });

        }catch (e){
            console.log(e);
            res.status(500).json(e)
        }

    }catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
}


exports.update_product = async (req, res) => {
    try{
         const {productId, ...other} = req.body;

        const preExisted = await Product.findOne({"name": { $regex: new RegExp("^" + req.body.name.toLowerCase(), "i") } }).exec();
        if(preExisted){
            if(preExisted._id === req.body.productId){
                 return res.status(500).json({
                    message: 'Product with these detail already exist'
                })
            }
        }

        try {
            const product = await Product.findByIdAndUpdate(productId, other, {
                returnOriginal: false
            }).exec();
            const result = await product.populate([
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

            res.status(200).json({
                message: 'Updated successfully',
                product: result
            })
        }catch (err){
            console.log(err);
            res.status(500).json(err)
        }
    }catch (err){
        console.log(err);
        return res.status(500).json(err)
    }
}

exports.delete_product = async (req, res) => {
    try{
        const productId = req.params.productId;
        const product = await Product.findById(productId).exec();
        if(!product){
            return res.status(500).json({
                message: 'Product not found'
            })
        }

        product.deleteOne();
        res.status(200).json({
            message: 'Product deleted successfully'
        });

    }catch (err){
        console.log(err);
        return res.status(500).json(err)
    }

}

exports.fetch_products = async (req, res) => {
    const data = await Product.find().populate([
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
    ]).exec();

    res.status(200).json(data)
}

