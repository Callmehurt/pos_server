
const Category = require('../../models/Category');
const Media = require('../../models/Media');
const mongoose = require('mongoose');



exports.create_category = async (req, res) => {
    try{

        const preData = await Category.findOne({name: req.body.name}).exec();
        if(preData){
            return res.status(500).json({
                message: 'Category already exist'
            })
        }

        const parent = await Category.findById(req.body.parentId, {name: 1}).exec();
        const media = await Media.findById(req.body.mediaId, {image: 1}).exec();

        const newCategory = new Category({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            parent: parent,
            media: media,
        })

        try {
            await newCategory.save();
            res.status(200).json({
                message: 'Category created successfully',
                category: newCategory
            })
        }catch (e){
            res.status(500).json(e);
        }

    }catch (err){
        console.log(err);
        res.status(500).json(err)
    }
}

exports.delete_category = async (req, res) => {
    try{
        const categoryId = req.params.categoryId;
        const preData = await Category.findById(categoryId).exec();
        // const data = await Category.find({"parent._id" : preData._id});
        // res.status(200).json({
        //                 data: data
        //             })


        if(!preData){
            return res.status(500).json({
                message: 'Category does not exist'
            })
        }

        await Category.deleteMany({"parent._id" : preData._id});
        preData.deleteOne();
        res.status(200).json({
            message: 'Category deleted successfully'
        })

    }catch (e){
        console.log(e);
        return res.status(500).json(e);
    }
}
