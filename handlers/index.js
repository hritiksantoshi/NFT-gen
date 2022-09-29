const Model = require('../models');
const statusCodeList = require("../statusCodes/statusCodes");
const messageList = require("../messages/messages");
const messages = messageList.MESSAGES;
const statusCodes = statusCodeList.STATUS_CODE;
const universalFunction = require('../lib/universal-function');
const upload = require("../services/upload");
const fs = require('fs');
const basePath = process.cwd();
const nftDir = `${basePath}/NFTs`
const {buildSetup,createFiles,createMetaData,Canvas} = require('../src/main');
module.exports.signup = async (req,res) =>{
    try{
      let payload = req.body;
      let existingUser = await Model.users.findOne({
          email: payload.email
      });

      if (existingUser) 
          return {
              status: statusCodes.UNPROCESSABLE_ENTITY,
              message: messages.EMAIL_ALREADY_TAKEN
          };
      payload.password = await universalFunction.hashPasswordUsingBcrypt(payload.password);
  
      let user = await Model.users.create(payload);
      let accessToken = await universalFunction.jwtSign(user);
  
      return {
          status: statusCodes.CREATED,
          message: messages.USER_REGISTER_SUCCESSFULLY,
          data: {
              accessToken: accessToken
          }
      };
    }
    catch(err){
        throw err;
    }
  } 

  module.exports.login = async function (req) {
    try {

        let payload = req.body;
        let user = await Model.users.findOne({
            email: payload.email
        });

        if (!user) return {
            status: statusCodes.NOT_FOUND,
            message: messages.USER_NOT_FOUND
        };

        let passwordIsCorrect = await universalFunction.comparePasswordUsingBcrypt(payload.password, user.password);

        if (!passwordIsCorrect) {
            return {
                status: statusCodes.BAD_REQUEST,
                message: messages.INVALID_PASSWORD
            }
        };

        let accessToken = await universalFunction.jwtSign(user);

        return {
            status: statusCodes.SUCCESS,
            message: messages.USER_LOGIN_SUCCESSFULLY,
            data: {
                accessToken: accessToken
            }
        }
    }
    catch (error) {

        throw error;

    }
}

module.exports.createCollection = async function (req) {
    try {

        let payload = req.body;
        let collection = await Model.collections.findOne({
            name: payload.collection,
            userID:req.loggedUser._id
        });
      
        if (collection){ 
            return {
            status: statusCodes.BAD_REQUEST,
            message:'collection already exists'
        }
    }
        
    
        let userDir = `${nftDir}/${req.loggedUser._id}`
        if(!fs.existsSync(userDir)){
            fs.mkdirSync(userDir);  
          
        }
        fs.mkdirSync(`${userDir}/${payload.collection}`)

        let width = parseInt(payload.width);
        let height = parseInt(payload.height);

        let createCollection = {
            userID:req.loggedUser._id,
            name: payload.collection,
            height:height,
            width:width
        }
        let saveCollection = await Model.collections.create(createCollection);
       
        return {
            status: statusCodes.SUCCESS,
            message:'COLLECTION_CREATED_SUCCESSFULLY',
        }
    }
    catch (error) {

        throw error;

    }
}

module.exports.addLayers = async function (req) {
    try {

        let payload = req.body;
        let layer = await Model.layers.findOne({
            Name: payload.name,
            collectionId:req.query.collectionId
        });

        if (layer){ 
            return {
            status: statusCodes.BAD_REQUEST,
            message:'layer already exists'
        }
    }
          
        let collection = await Model.collections.findOne({
            _id:req.query.collectionId
        })
        
    
        let layerDir = `${nftDir}/${req.loggedUser._id}/${collection.name}/layers`
        if(!fs.existsSync(layerDir)){
            fs.mkdirSync(layerDir);      
        }

        fs.mkdirSync(`${layerDir}/${payload.name}`);

        let addLayer = {
            Name: payload.name,
            collectionId:req.query.collectionId
        };
        
        let LayerOrder = await Model.collections.updateOne({_id:collection._id},{$set:{layersOrder:[...collection.layersOrder,payload.name],layers:collection.layers+1}});
        let saveLayer = await Model.layers.create(addLayer);
    
        return {
            status: statusCodes.SUCCESS,
            message:'LAYER_CREATED_SUCCESSFULLY',
        }
    }
    catch (error) {

        throw error;

    }
}

module.exports.uploadImges = async function (req) {
    try { 

          let collection = await Model.collections.findOne({
            name:req.query.name
          });
          
         
          let occurences = {};
          req.files.forEach(({fieldname}) => {
            if(occurences[fieldname]){
                occurences[fieldname]++;
            }
            else{
                occurences[fieldname] = 1;
            }
          });

            for (const key in occurences) {
                if (Object.hasOwnProperty.call(occurences, key)) {
                    const Images = occurences[key];
                    await Model.layers.findOneAndUpdate({collectionId:collection._id,Name:key},{$set:{Images}});
                    
                }
            }


          return {
            status: statusCodes.SUCCESS,
            message:'UPLOADED',
        }
        
    }
    catch (error) {

        throw error;

    }
}

module.exports.generateNFT = async function (req) {
    try { 
             if(req.fileValidationError){
        res.send(req.fileValidationError);
    }else{
          let collection = await Model.collections.findOne({
            _id:req.body.collectionId,
            userID:req.loggedUser._id
          })
        let width = parseInt(collection.width);
        let height = parseInt(collection.height);
        Canvas(width,height);
        let collectionName = req.body.name;
        let buildPath = `${nftDir}/${req.loggedUser._id}/${collection.name}/build`;
        let _edition = req.body.edition;
        let layerOrder = collection.layersOrder.map((name) =>{
            let number = fs.readdirSync(`${nftDir}/${req.loggedUser._id}/${collection.name}/layers/${name}`).length;
            return {
                name,number
            }
        })
        buildSetup(buildPath);
        await createFiles(layerOrder,_edition,`${nftDir}/${req.loggedUser._id}/${collection.name}/layers`);

      
       
        return {
            status: statusCodes.SUCCESS,
            message:'CREATED',
        }


    }
        
    }
    catch (error) {

        throw error;

    }
}