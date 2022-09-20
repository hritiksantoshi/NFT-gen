const fs = require("fs");
const { config } = require("process");
const upload = require("../services/fileUploadService");
const {layers} = require('../src/config')
const {buildSetup,createFiles,createMetaData,Canvas} = require('../src/main');


module.exports.upload = function(req,res,next){
    let filedir = "./layers";
    fs.readdirSync(filedir).forEach((folder) => {
      fs.readdirSync(filedir + "/" + folder).forEach((file) => {
        fs.unlinkSync(filedir + "/" + folder + "/" + file);
      });
      fs.rmdirSync(filedir + "/" + folder);
    });
    req.layers = [];
    upload.NFtimg.any()(req, res, next);
}


module.exports.NFTgen = function(req,res){
    if(req.fileValidationError){
        res.send(req.fileValidationError);
    }else{
        let width = parseInt(req.body.width);
        let height = parseInt(req.body.height);
        Canvas(width,height);
        let filedir = "./layers";
        let layersOrder = [];
        for(let i =0;i<req.layers.length;i++){
          let files = fs.readdirSync(filedir + "/" + req.layers[i]);
            layersOrder.push({name:req.layers[i],number:files.length})
        };
        console.log(layersOrder);
        let _edition = layersOrder.reduce((a,b) =>{
          return {number:a.number+b.number}
        });
        buildSetup();
        createFiles(layersOrder,10);
        createMetaData();
       res.send("done")
    }
    
}

