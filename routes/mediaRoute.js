const express = require('express')
const multer = require('multer');
const router = express.Router();
const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles')

const mediaUploadController = require('../controllers/media/mediaUploadController');


const upload = multer({
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be jpg'))
        }
        cb(undefined, true)
    }
});


router.post('/upload-media', verifyToken, verifyRole('admin'), upload.array('media', 20), mediaUploadController.upload_media, (error, req, res, next) => {
    res.status(400).json({error: error.message})
});

router.delete('/delete/media/:id', verifyToken, verifyRole('admin'), mediaUploadController.delete_media);
router.get('/get/media/:id', verifyToken, verifyRole('admin'), mediaUploadController.serve_media);
router.get('/fetch/media/:id', mediaUploadController.serve_media);
router.get('/fetch/all-media', verifyToken, verifyRole('admin'), mediaUploadController.media_list);

module.exports = router;