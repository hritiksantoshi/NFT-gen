const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!req.layers.includes(file.fieldname)){
            req.layers.push(file.fieldname);
        }

        let filedir = './layers';
        fs.mkdirSync(filedir+'/'+file.fieldname,{recursive:true});
       cb(null,filedir+'/'+file.fieldname)
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