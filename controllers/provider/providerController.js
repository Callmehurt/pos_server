const Provider = require('../../models/Providers');
const StockFlow = require('../../models/StockFlow');
const Procurement = require('../../models/Procurements');
const mongoose = require('mongoose');


exports.create_provider = async (req, res) => {
    try {

        const {name, email, phone, address} = req.body;

        const existed = await Provider.findOne({"name": { $regex: new RegExp("^" + name.toLowerCase(), "i") } });
        if(existed){
            return res.status(500).json({
                message: 'Provider already exist'
            })
        }

        const newRecord = new Provider({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            email: email,
            phone: phone,
            address: address,
        });

        await newRecord.save();

        res.status(200).json({
            message: 'Provider added successfully',
            provider: newRecord
        })

    }catch (e) {
        return res.status(500).json(e)
    }
}


exports.update_provider = async (req, res) => {
    try{
        const {providerId, ...other} = req.body;
        const preExisted = await Provider.findOne({"name": { $regex: new RegExp("^" + req.body.name.toLowerCase(), "i") } }).exec();
        if(preExisted){
            if(preExisted._id !== providerId){
                 return res.status(500).json({
                    message: 'Provider with these detail already exist'
                })
            }
        }

        try {
            const provider = await Provider.findByIdAndUpdate(providerId, other, {
                returnOriginal: false
            }).exec();

            res.status(200).json({
                message: 'Updated successfully',
                provider: provider
            })
        }catch (err){
            console.log(err);
            res.status(500).json(err)
        }

        res.status(200).json(preExisted);

    }catch (e) {
        return res.status(500).json(e)
    }
}

exports.fetch_providers_data = async (req, res) => {
    try{

        const data = await Provider.find().sort({name: -1});
        res.status(200).json(data)

    }catch (e) {
        return res.status(500).json(e)
    }
}

exports.delete_provider = async (req, res) => {
     try{

         const providerId = req.params.providerId;
        const data = await Provider.findById(providerId);

        await StockFlow.deleteMany({provider: data.id});
        await Procurement.deleteMany({provider: data.id});
        data.deleteOne();
        res.status(200).json({
            message: 'Provider deleted successfully'
        })

    }catch (e) {
        return res.status(500).json(e)
    }
}