const multer = require('multer');
const path = require('path');
const fs = require('fs');
const basePath = process.cwd();
let nftDir = `${basePath}/NFTs`;
const userUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        // if(!req.layers.includes(file.fieldname)){
        //     req.layers.push(file.fieldname);
        // }
         console.log(req.user,"hjh");
        // let filedir = './'+req.loggedUser.firstName+'./layers';
        // fs.mkdirSync(`${req.layerdir}/${file.fieldname}`,{recursive:true});
       cb(null,`${nftDir}/${req.loggedUser._id}/layers/${file.fieldname}`);
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
module.exports = {
    NFtimg: NFtimg
};