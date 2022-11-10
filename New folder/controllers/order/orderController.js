const Orders = require('../../models/Orders');
const Product = require('../../models/Product');
const StockFlow = require('../../models/StockFlow');
const CashFlow = require('../../models/CashFlow');
const mongoose = require('mongoose');

const orderId = require('order-id')('order');

exports.search_products = async (req, res) => {
    try{
        const {productName} = req.query;
        const searchedProducts = await Product.find({"name": { $regex: new RegExp("^" + productName.toLowerCase(), "i") },  "onPos": true, onStock: {$gt : 0}}, {
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

exports.setup_order = async (req, res) => {
    try {
        const newData = {...req.body};
        if(newData.calculationType === 'old'){
            if(newData?.prevPartial){
                newData['partialPayment'] = true;
                newData['paidAmount'] = parseInt(newData.paidAmount)+parseInt(newData.partialPaidAmount)
                const {orderId, ...others} = newData;
                const order = await Orders.findByIdAndUpdate(orderId, others, {
                        returnOriginal: false
                    }).exec();
                if(order.orderStatus === 'complete'){
                    await Promise.all(
                        order.products.map(async (product) => {
                            const thisProduct = await Product.findById(product.productId);
                            const newQuantity = parseInt(thisProduct.onStock) - parseInt(product.quantity);

                            // if(thisProduct.stockManagement && parseInt(thisProduct.onStock) < parseInt(product.quantity)){
                            //     return res.status(400).json({
                            //         message: 'Quantity error'
                            //     })
                            // }
                            //
                            // const stockRecord = new StockFlow({
                            //     _id: new mongoose.Types.ObjectId(),
                            //     product: thisProduct._id,
                            //     operationType: 'sale',
                            //     order: order.orderCode,
                            //     initialQuantity: thisProduct.onStock,
                            //     quantity: product.quantity,
                            //     amount: product.total,
                            //     newQuantity: newQuantity
                            // });
                            // await stockRecord.save();
                            // if(thisProduct.stockManagement){
                            //     await Product.findByIdAndUpdate(thisProduct._id, {onStock: newQuantity});
                            // }
                        })
                    );

                    const cashFlow = new CashFlow({
                        _id: new mongoose.Types.ObjectId(),
                        name: 'Sale: '.concat(order.orderCode),
                        value: parseInt(order.total)-parseInt(order.partialPaidAmount),
                        operation: 'credit',
                    })
                    await cashFlow.save();
                }
                res.status(200).json({
                    message: 'Order created successfully',
                    order: order
                });
            }else {
                const {orderId, ...others} = newData;
                const order = await Orders.findByIdAndUpdate(orderId, others, {
                        returnOriginal: false
                    }).exec();
                if(order.orderStatus === 'complete'){
                    await Promise.all(
                        order.products.map(async (product) => {
                            const thisProduct = await Product.findById(product.productId);
                            const newQuantity = parseInt(thisProduct.onStock) - parseInt(product.quantity);

                            if(thisProduct.stockManagement && parseInt(thisProduct.onStock) < parseInt(product.quantity)){
                                return res.status(400).json({
                                    message: 'Quantity error'
                                })
                            }
                            const stockRecord = new StockFlow({
                                _id: new mongoose.Types.ObjectId(),
                                product: thisProduct._id,
                                operationType: 'sale',
                                order: order.orderCode,
                                initialQuantity: thisProduct.onStock,
                                quantity: product.quantity,
                                amount: product.total,
                                newQuantity: newQuantity
                            });
                            await stockRecord.save();
                            if(thisProduct.stockManagement){
                                await Product.findByIdAndUpdate(thisProduct._id, {onStock: newQuantity});
                            }
                        })
                    );

                    if(order.partialPayment){
                        const cashFlow = new CashFlow({
                        _id: new mongoose.Types.ObjectId(),
                        name: 'Sale: '.concat(order.orderCode),
                        value: order.partialPaidAmount,
                        operation: 'credit',
                        })
                        await cashFlow.save();
                    }else {
                        const cashFlow = new CashFlow({
                        _id: new mongoose.Types.ObjectId(),
                        name: 'Sale: '.concat(order.orderCode),
                        value: order.total,
                        operation: 'credit',
                        })
                        await cashFlow.save();
                    }
                }
                res.status(200).json({
                    message: 'Order created successfully',
                    order: order
                });
            }
        }else {
            const newOrder = new Orders({
                _id: new mongoose.Types.ObjectId(),
                orderCode: orderId.generate(),
                orderType: req.body.orderType,
                paymentStatus: req.body.paymentStatus,
                orderStatus: req.body.orderStatus,
                discountType: req.body.discountType,
                discountValue: req.body.discountValue,
                discountAmount: req.body.discountAmount,
                subTotal: req.body.subTotal,
                total: req.body.total,
                table: req.body.table,
                reference: req.body.reference,
                paymentMethod: req.body.paymentMethod,
                partialPayment: req.body.partialPayment,
                partialPaidAmount: req.body.partialPaidAmount,
                paidAmount: req.body.paidAmount,
                changeAmount: parseInt(req.body.changeAmount),
                products: req.body.products
            });

            try{
                await newOrder.save();
                if(req.body.orderStatus === 'complete'){
                    await Promise.all(
                        newOrder.products.map(async (product) => {
                            const thisProduct = await Product.findById(product.productId);
                            const newQuantity = parseInt(thisProduct.onStock) - parseInt(product.quantity);

                            if(thisProduct.stockManagement && parseInt(thisProduct.onStock) < parseInt(product.quantity)){
                                return res.status(400).json({
                                    message: 'Quantity error'
                                })
                            }

                            const stockRecord = new StockFlow({
                                _id: new mongoose.Types.ObjectId(),
                                product: thisProduct._id,
                                operationType: 'sale',
                                order: newOrder.orderCode,
                                initialQuantity: thisProduct.onStock,
                                quantity: product.quantity,
                                amount: product.total,
                                newQuantity: newQuantity
                            });
                            await stockRecord.save();
                            if(thisProduct.stockManagement){
                                await Product.findByIdAndUpdate(thisProduct._id, {onStock: newQuantity});
                            }
                        })
                    );

                    if(newOrder.partialPayment){
                        const cashFlow = new CashFlow({
                        _id: new mongoose.Types.ObjectId(),
                        name: 'Sale: '.concat(newOrder.orderCode),
                        value: newOrder.partialPaidAmount,
                        operation: 'credit',
                        })
                        await cashFlow.save();
                    }else {
                        const cashFlow = new CashFlow({
                        _id: new mongoose.Types.ObjectId(),
                        name: 'Sale: '.concat(newOrder.orderCode),
                        value: newOrder.total,
                        operation: 'credit',
                        })
                        await cashFlow.save();
                    }
                }
                res.status(200).json({
                    message: 'Order created successfully',
                    order: newOrder
                });
            }catch (e) {
                return res.status(500).json(e)
            }
        }
    }catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}


exports.fetchSpecificOrders = async (req, res) => {
    try {
        const {orderType} = req.query;

        if(orderType === 'partial'){
            const orders = await Orders.find({paymentStatus: orderType, partialPayment: true});
            res.status(200).json(orders)
        }else {
            const orders = await Orders.find({orderStatus: orderType});
            res.status(200).json(orders)
        }

    }catch (e) {
        return res.status(500).json(e)
    }
}

exports.deleteOrder = async (req, res) => {
    try{

        const orderId = req.params.orderId;

        const order = await Orders.findById(orderId).exec();
        if(!order){
            return res.status(500).json({
                message: 'Record not found'
            });
        }

        order.deleteOne();

        res.status(200).json({
            message: 'Order deleted successfully'
        })

    }catch (e){
        return res.status(500).json(e)
    }
}

exports.fetchOrders = async (req, res) => {
    try{

        const data = await Orders.find().sort({createdAt: -1});
        res.status(200).json(data)

    }catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}
