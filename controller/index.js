const fs = require("fs");
const basePath = process.cwd();
const upload = require("../services/fileUploadService");
const Handler = require('../handlers')
const {buildSetup,createFiles,createMetaData,Canvas} = require('../src/main');
const universalFunction = require('../lib/universal-function');
const buildDir = `${basePath}/build/images`;
const Model = require('../models');
let metafile = `${basePath}/build/json`;
module.exports.signup = async function (req, res) {
  try {

      const response = await Handler.signup(req);
      return universalFunction.sendResponse(res, response.status, response.message, response.data);

  } catch (error) {

      return universalFunction.errorResponse(res, error);

  }
};


module.exports.login = async function (req, res) {
  try {
      
      const response = await Handler.login(req);
      return universalFunction.sendResponse(res, response.status, response.message, response.data);

  } catch (error) {

      return universalFunction.errorResponse(res, error);

  }
};

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


module.exports.NFTgen = async function(req,res){
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
            layersOrder.push({name:req.layers[i],number:files.length});
        };
        let _edition = req.body.edition;
        buildSetup();
        await createFiles(layersOrder,_edition);
        createMetaData();
        let collection = {
          userID:req.loggedUser._id,
          name:req.body.collection,
          layers:fs.readdirSync(filedir).length,
          // details:fs.readFileSync(metafile+'/'+'_metadata.json')
        }
        
        await Model.collections.create(collection);
        let nfts = fs.readdirSync(buildDir).map((name) => `/images/${name}`);
        let data = fs.readFileSync(metafile+'/'+'_metadata.json');
       
        console.log(data);
        res.send({...nfts});
    }
    
}

