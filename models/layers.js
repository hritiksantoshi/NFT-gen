const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LayerModel = new Schema({
    Name: {
        type: String, default: ''
    },
    Images: {
        type: String, default: ''
    },
    collectionId:{
        type:Schema.Types.ObjectId,
        ref:'collections'
    }
    
},{timestamps:true});

module.exports = mongoose.model('layers', LayerModel);