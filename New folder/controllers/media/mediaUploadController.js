
const Media = require('../../models/Media')
const mongoose = require("mongoose");
const sharp = require('sharp')


exports.upload_media = async (req, res) => {
    const mediaFiles = req.files;

    if(mediaFiles.length < 1){
        res.status(202).json({
            message: 'File is missing'
        })
    }


    const list = await Promise.all(
         mediaFiles.map(async (file, index) => {
            let buffer = await sharp(file.buffer).resize({width: 250, height: 250}).png().toBuffer();
            const newMedia = new Media({
                _id: new mongoose.Types.ObjectId(),
                image: buffer,
            });
            try {
                await newMedia.save();
                return newMedia;
            }catch (e){
                console.log(e)
                res.status(500).json(e)
            }
        })
    )

    res.status(200).json({
        data: list,
        message: 'Media uploaded successfully',
    })
}

exports.serve_media = async (req, res) => {
    try{
        const media = await Media.findById(req.params.id);
        if(!media){
            throw new Error('Media not found');
        }

        res.set('Content-Type', 'image/png');
        res.send(media.image);
    }catch (err){
        res.status(404).send({
            error: err.message
        });
    }
}

exports.media_list = async (req, res) => {
    const medias = await Media.find({}).sort({createdAt: -1}).exec();
    res.status(200).json(medias)
}


exports.delete_media = async (req, res) => {
    try{
        const media = await Media.findById(req.params.id);
        if(!media){
            throw new Error('Media not found');
        }
        await media.deleteOne();
        res.status(200).json({
            message: 'Media deleted successfully'
        })
    }catch (err){
        res.status(404).send({
            error: err.message
        });
    }
}