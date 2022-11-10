const Procurements = require('../../models/Procurements');
const Product = require('../../models/Product');
const StockFlow = require('../../models/StockFlow');
const CashFlow = require('../../models/CashFlow');
const Providers = require('../../models/Providers');
const mongoose = require('mongoose');


exports.register_procurement = async (req, res) => {
    try{

        const newRecord = new Procurements({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            invoiceNumber: req.body.invoiceNumber,
            deliveryDate: req.body.deliveryDate,
            invoiceDate: req.body.invoiceDate,
            deliveryStatus: req.body.deliveryStatus,
            paymentStatus: req.body.paymentStatus,
            provider: req.body.provider,
            products: req.body.products,
            purchaseValue: req.body.totalPurchaseValue,
            saleValue: req.body.totalSaleValue
        })

        if(req.body.deliveryStatus === 'stocked'){
            await Promise.all(
                req.body.products.map(async (data) => {
                    const newQuantity = parseInt(data.onStock) + parseInt(data?.changedQuantity ? data.changedQuantity : 1);

                    const stockRecord = new StockFlow({
                        _id: new mongoose.Types.ObjectId(),
                        product: data._id,
                        operationType: 'add',
                        procurement: newRecord._id,
                        initialQuantity: data.onStock,
                        quantity: data?.changedQuantity ? data.changedQuantity : 1,
                        amount: parseInt(data?.changedQuantity ? data.changedQuantity : 1)*parseInt(data.salePrice),
                        newQuantity: newQuantity
                    });
                    await stockRecord.save();
                    await Product.findByIdAndUpdate(data._id, {onStock: newQuantity});
                })
            );

            const cashFlow = new CashFlow({
                _id: new mongoose.Types.ObjectId(),
                name: 'Procurement: '.concat(newRecord.name),
                value: newRecord.purchaseValue,
                operation: 'debit',
            });
            await cashFlow.save();
        }

        await newRecord.save();

        const provider = await Providers.findById(newRecord.provider);
        if(newRecord.paymentStatus === 'paid'){
            await Providers.findByIdAndUpdate({_id: newRecord.provider}, {amountPaid: parseInt(provider.amountPaid) + parseInt(newRecord.purchaseValue)})
        }else {
            await Providers.findByIdAndUpdate({_id: newRecord.provider}, {amountDue: parseInt(provider.amountDue) + parseInt(newRecord.purchaseValue)})
        }
        const result = await newRecord.populate({
            strictPopulate: false,
            path: 'providers',
            select: 'name'
        });

        res.status(200).json({
            message: 'Procurement recorded successfully',
            procurement: result
        });

    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}

exports.update_procurement = async (req, res) => {
    try{

        const {procurementId, ...other} = req.body;
        const procurement = await Procurements.findById(procurementId);
        if(req.body.deliveryStatus === 'stocked'){
            await Promise.all(
                req.body.products.map(async (data) => {
                    const newQuantity = parseInt(data.onStock) + parseInt(data?.changedQuantity ? data.changedQuantity : 1);

                    const stockRecord = new StockFlow({
                        _id: new mongoose.Types.ObjectId(),
                        product: data._id,
                        operationType: 'add',
                        procurement: procurementId,
                        initialQuantity: data.onStock,
                        quantity: data?.changedQuantity ? data.changedQuantity : 1,
                        amount: parseInt(data?.changedQuantity ? data.changedQuantity : 1)*parseInt(data.salePrice),
                        newQuantity: newQuantity
                    });
                    await stockRecord.save();
                    await Product.findByIdAndUpdate(data._id, {onStock: newQuantity});
                })
            );


            const cashFlow = new CashFlow({
                _id: new mongoose.Types.ObjectId(),
                name: 'Procurement: '.concat(procurement.name),
                value: procurement.purchaseValue,
                operation: 'debit',
            });
            await cashFlow.save();
        }

        const provider = await Providers.findById(other.provider);
        if(other.paymentStatus === 'paid'){
            if(procurement.paymentStatus === 'unpaid'){
                await Providers.findByIdAndUpdate({_id: other.provider}, {amountPaid: parseInt(provider.amountPaid) + parseInt(other.purchaseValue), amountDue: parseInt(provider.amountDue) - parseInt(other.purchaseValue)});
            }
        }

        const data = await Procurements.findByIdAndUpdate(procurementId, other, {
                returnOriginal: false
            })
        res.status(200).json({
            message: 'Procurement updated successfully',
            data: data
        })

    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}

exports.fetch_procurements = async (req, res) => {
    try{

        const data = await Procurements.find().populate({
            strictPopulate: false,
            path: 'provider',
            select: 'name'
        }).sort({createdAt: -1});


        res.status(200).json(data);

    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}

exports.delete_procurement = async (req, res) => {
    try{
        const procurementId = req.params.procurementId;

        const data = await Procurements.findById(procurementId);
        await StockFlow.deleteMany({procurement: data.id});
        data.deleteOne();

        res.status(200).json({
            message: 'Procurement deleted successfully'
        })

    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}