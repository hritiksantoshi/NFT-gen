const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NftsModel = new Schema({
    collectionId: {
        type: Schema.Types.ObjectId,
        ref: 'collections',
        required: true
    },
    name: {
        type: String,
        required: true,
         default: ''
    },
    imgUrl:{
        type: String,
        default:''
    },
    createrId:{
        type: Schema.Types.ObjectId,
        ref:'collections',
        required: true
    },
    details:{
        type: Array
    }
    
},{timestamps:true});

module.exports = mongoose.model('nfts', NftsModel);