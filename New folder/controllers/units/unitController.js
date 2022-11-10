const UnitGroup = require('../../models/UnitGroup');
const Units = require('../../models/Units');
const mongoose = require('mongoose');


exports.create_unit_group = async (req, res) => {
    try {

        if(req.body.name === '' || req.body.name === null){
            return res.status(400).json({
                message: 'Unit group name is required'
            });
        }
        const prevUnit = await UnitGroup.findOne({name: req.body.name}).exec();

        if(prevUnit){
            return res.status(400).json({
               message: 'Unit group already exist'
            });
        }

        const newUnitGroup = new UnitGroup({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            description: req.body.description,
        })

        try {
            await newUnitGroup.save();
            res.status(200).json({
                message: 'Unit group created successfully',
                data: newUnitGroup
            })
        }catch (err){
            console.log(err)
            res.status(500).json(err)
        }

    }catch (e) {
        console.log(e);
        res.status(500).json(e)
    }
}


exports.delete_unit_group = async (req, res) => {
    try {

        const unitGroupId = req.params.unitGroupId;

        const unit = await UnitGroup.findById(unitGroupId).exec();

        if(!unit){
            return res.status(500).json({
                message: 'Unit group not found'
            })
        }

        await Units.deleteMany({unitGroup: unit.id});
        unit.deleteOne();
        res.status(200).json({
            message: 'Unit group deleted successfully'
        })

    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}

exports.fetch_unit_group = async (req, res) => {
    const data = await UnitGroup.find({}).exec();
    res.status(200).json(data);
}


//unit actions
exports.create_unit = async (req, res) => {
    try {

        const name = req.body.name;
        const identifier = req.body.identifier;
        const value = req.body.value;
        const unitGroup = req.body.unit_group;

        if(name === '' || identifier === '' || value === '' || unitGroup === ''){
            return res.status(500).json({
                message: 'All fields are required'
            })
        }

        const existedUnit = await Units.findOne({$or: [{name:name}, {identifier: identifier}]}).exec();

        if(existedUnit){
            return res.status(500).json({
                message: 'Unit already existed'
            })
        }

        const newUnit = new Units({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            identifier: identifier,
            unitGroup: unitGroup,
            value: value
        })

        try{
            await newUnit.save();
            const result = await newUnit.populate({
                strictPopulate: false,
                path: 'unitGroup',
                select: 'name'
            });
            res.status(200).json({
                message: 'Unit created successfully',
                data: result
            })
        }catch (err){
            console.log(err);
            res.status(500).json(err)
        }


    }catch (e){
        console.log(e);
        res.status(500).json(e)
    }
}


exports.update_unit = async (req, res) => {
    try{
        const {unitId, ...other} = req.body.updatedFields;

        const preExisted = await Units.findOne(other).exec();
        if(preExisted){
            return res.status(500).json({
                message: 'Unit with these detail already exist'
            })
        }

        try {
            const unit = await Units.findByIdAndUpdate(unitId, other, {
                returnOriginal: false
            }).exec();
            const result = await unit.populate({
                strictPopulate: false,
                path: 'unitGroup',
                select: 'name'
            });

            res.status(200).json({
                message: 'Updated successfully',
                data: result
            })
        }catch (err){
            console.log(err);
            res.status(500).json(err)
        }

    }catch (e) {
        console.log(e);
        res.status(500).json(e)
    }
}

exports.delete_unit = async (req, res) => {
    try {

        const unitId = req.params.unitId;

        const unit = await Units.findById(unitId).exec();

        if(!unit){
            return res.status(500).json({
                message: 'Unit not found'
            })
        }

        unit.deleteOne();
        res.status(200).json({
            message: 'Unit deleted successfully'
        })

    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}


exports.fetch_units = async (req, res) => {
    // let finalResult = [];
    // const result = await UnitGroup.aggregate([{
    //     $lookup: {
    //         from: "units",
    //         localField: "_id",
    //         foreignField: "unitGroup",
    //         as: "units"
    //     }
    // }]).then((response) => {
    //     response.forEach((data) => {
    //         finalResult = [...finalResult, data.units]
    //         // res.status(200).json(obj)
    //     })
    // })

    const result = await Units.find().populate({
        strictPopulate: false,
        path: 'unitGroup',
        select: 'name'
    });

    res.status(200).json(result)
}



