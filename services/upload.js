const multer = require('multer');
const path = require('path');
let nftDir = './NFTs'

module.exports = {
    NFtimg: (req,res,next)=>{
        let collection = req.query.name;
        const userUpload = multer.diskStorage({
            destination: function (req, file, cb) {
               cb(null,`${nftDir}/${req.loggedUser._id}/${collection}/layers/${file.fieldname}`);
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        });
        const NFtimg = multer({ storage: userUpload,
            fileFilter: function (req, file, callback) {
                var ext = path.extname(file.originalname);
                if(ext !== '.png') {
                    req.fileValidationError = 'Only pngs are allowed'
                    return callback(null,false);
                }
                callback(null, true)
            } });
            NFtimg.any()(req,res,next)
    }
};