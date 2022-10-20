const mongoose = require('mongoose');
const Table = require('../../models/Tables');

exports.create_table = async (req, res) => {
    try{

        const preData = await Table.findOne({"tableNumber": { $regex: new RegExp("^" + req.body.tableNumber.toLowerCase(), "i") } }).exec();
        if(preData){
            return res.status(500).json({
                message: 'Table already exist'
            })
        }

        const newTable = new Table({
            _id: new mongoose.Types.ObjectId(),
            tableNumber: req.body.tableNumber,
            tableSpace: req.body.tableSpace,
            status: req.body.status
        })

        try {
            await newTable.save();
            res.status(200).json({
                message: 'Table created successfully',
                table: newTable
            })
        }catch (e) {
            return res.status(500).json(e)
        }

    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}

exports.fetch_tables = async (req, res) => {
    try{
        const data = await Table.find().sort({tableNumber: 1});
        res.status(200).json(data);
    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}

exports.update_table = async (req, res) => {
    try{
        const {tableId, ...other} = req.body;
        const preExisted = await Table.findOne({"tableNumber": { $regex: new RegExp("^" + req.body.tableNumber.toLowerCase(), "i") } }).exec();
        if(preExisted){
            if(preExisted._id !== tableId){
                 return res.status(500).json({
                    message: 'Table already exist'
                })
            }
        }

        try{
             const table = await Table.findByIdAndUpdate(tableId, other, {
                returnOriginal: false
            }).exec();

            res.status(200).json({
                message: 'Updated successfully',
                table: table
            })
        }catch (e) {
            console.log(e);
            return res.status(500).json(e)
        }

    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}

exports.delete_table = async (req, res) => {
    try{
        const tableId = req.params.tableId;
        const data = await Table.findById(tableId);

        data.deleteOne();

        res.status(200).json({
            message: 'Deleted successfully'
        })

    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}