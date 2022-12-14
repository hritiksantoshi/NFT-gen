const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CollectionModel = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    name: {
        type: String,
        required: true,
         default: ''
    },
    height:{
        type: Number,
        required: true
    },
    width:{
        type: Number,
        required: true
    },
    layers:{
        type: String,
        default:''
    },
    layersOrder:{
       type:Array
    },
    details:{
        type: Array
    }
    
},{timestamps:true});

module.exports = mongoose.model('collections', CollectionModel);