
const Category = require('../../models/Category');
const Media = require('../../models/Media');
const Product = require('../../models/Product');
const mongoose = require('mongoose');



exports.create_category = async (req, res) => {
    try{

        const preData = await Category.findOne({"name": { $regex: new RegExp("^" + req.body.name.toLowerCase(), "i") } }).exec();
        if(preData){
            return res.status(500).json({
                message: 'Category already exist'
            })
        }

        let parent = null;
        if(req.body.parentId !== ''){
            parent = await Category.findOne({_id: req.body.parentId}, {name: 1}).exec();
        }
        let media = null;
        if(req.body.mediaId !== ''){
            media = await Media.findById(req.body.mediaId, {image: 1}).exec();
        }

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

exports.update_category = async (req, res, next) => {
    try{
        const preData = await Category.findOne( {"name": { $regex: new RegExp("^" + req.body.name.toLowerCase(), "i") } }).exec();
        if(preData){
            if(preData._id === req.body.categoryId){
                return res.status(500).json({
                    message: 'Category already exist'
                })
            }
        }

        let parent = null;
        if(req.body.parentId !== ''){
            parent =  await Category.findOne({_id: req.body.parentId}, {name: 1}).exec();
        }
        const media = await Media.findById(req.body.mediaId, {image: 1}).exec();

        const updated = {
            media: media,
            parent: parent
        }
        const category = await Category.findByIdAndUpdate(req.body.categoryId, updated, {
                returnOriginal: false
            }).exec();

        res.status(200).json({
            message: 'Category updated successfully',
            category: category
        });

    }catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

exports.delete_category = async (req, res) => {
    try{
        const categoryId = req.params.categoryId;
        const preData = await Category.findById(categoryId).exec();
        if(!preData){
            return res.status(500).json({
                message: 'Category does not exist'
            })
        }

        await Category.deleteMany({"parent._id" : preData._id});
        await Product.deleteMany({category : preData._id});
        preData.deleteOne();
        res.status(200).json({
            message: 'Category deleted successfully'
        })

    }catch (e){
        console.log(e);
        return res.status(500).json(e);
    }
}

exports.fetch_categories = async (req, res) => {
    try{
        const data = await Category.find({}).exec();
        res.status(200).json(data);
    }catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}

exports.fetch_child_categories = async (req, res) => {
    try{
        const parentId = req.params.parentId;
        const selected = await Category.findById(parentId);
        const data = await Category.find({'parent._id': selected._id})
        res.status(200).json(data);
    }catch (e){
        return res.status(500).json(e)
    }
}
