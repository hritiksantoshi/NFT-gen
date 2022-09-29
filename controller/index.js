const fs = require("fs");
const basePath = process.cwd();
const upload = require("../services/fileUploadService");
const Handler = require('../handlers')
const {buildSetup,createFiles,createMetaData,Canvas} = require('../src/main');
const universalFunction = require('../lib/universal-function');
const imgDir = `${basePath}/build/images`;
const Model = require('../models');
let metafile = `${basePath}/build/json`;
let nftDir = `${basePath}/NFTs`
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

module.exports.createCollection = async function (req, res) {
  try {
      
      const response = await Handler.createCollection(req);
      return universalFunction.sendResponse(res, response.status, response.message, response.data);

  } catch (error) {

      return universalFunction.errorResponse(res, error);

  }
};

module.exports.addLayers = async function (req, res) {
  try {
      
      const response = await Handler.addLayers(req);
      return universalFunction.sendResponse(res, response.status, response.message, response.data);

  } catch (error) {

      return universalFunction.errorResponse(res, error);

  }
};

module.exports.uploadImges = async function (req, res) {
  try {
      
      const response = await Handler.uploadImges(req);
      return universalFunction.sendResponse(res, response.status, response.message, response.data);

  } catch (error) {

      return universalFunction.errorResponse(res, error);

  }
};

module.exports.generateNFT = async function (req, res) {
  try {
      
      const response = await Handler.generateNFT(req);
      return universalFunction.sendResponse(res, response.status, response.message, response.data);

  } catch (error) {

      return universalFunction.errorResponse(res, error);

  }
};

module.exports.upload = function(req,res,next){
    let userDir = `${nftDir}/${req.loggedUser.firstName}`;
    let collectionDir = `${userDir}/${req.query.collection}`;
    let  layerDir = `${collectionDir}/layers`;
    if(fs.existsSync(userDir)){
      if(fs.existsSync(collectionDir)){
        fs.rmdirSync(collectionDir, { recursive: true });
      }
    }else{
      fs.mkdirSync(userDir);
    }
   
    fs.mkdirSync(collectionDir);
    fs.mkdirSync(layerDir);
    req.layers = [];
    req.collectiondir = collectionDir
    req.layerdir = layerDir;
    upload.NFtimg.any()(req, res,next);

}


module.exports.NFTgen = async function(req,res){
  console.log(req.body);
    if(req.fileValidationError){
        res.send(req.fileValidationError);
    }else{
        let width = parseInt(req.body.width);
        let height = parseInt(req.body.height);
        Canvas(width,height);
      
        let layersOrder = [];
        for(let i =0;i<req.layers.length;i++){
          let files = fs.readdirSync(req.layerdir + "/" + req.layers[i]);
            layersOrder.push({name:req.layers[i],number:files.length});
        };
        let _edition = req.body.edition;
        buildSetup(req.collectiondir);
        await createFiles(layersOrder,_edition,req.layerdir,req.collectiondir);
        createMetaData();
        let collection = {
          userID:req.loggedUser._id,
          name:req.body.collection,
          layers:fs.readdirSync(req.layerdir).length,
          // details:fs.readFileSync(metafile+'/'+'_metadata.json')
        }
        await Model.collections.create(collection);
        let nfts = fs.readdirSync(imgDir).map((name) => `/images/${name}`);
        let data = fs.readFileSync(metafile+'/'+'_metadata.json');
        res.send({...nfts});
    }
    
}

