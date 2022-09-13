const fs = require("fs");
const upload = require("../services/fileUploadService");


module.exports.upload = function(req,res,next){
    let filedir = "./layers";
    fs.readdirSync(filedir).forEach((folder) => {
      fs.readdirSync(filedir + "/" + folder).forEach((file) => {
        fs.unlinkSync(filedir + "/" + folder + "/" + file);
      });
      fs.rmdirSync(filedir + "/" + folder);
    });
    console.log(req.files);
    upload.NFtimg.any()(req, res, next);
}

module.exports.store = function(req,res){
    if(req.fileValidationError){
        res.send(req.fileValidationError);
    }else{
        res.send("done");
    }
    
}