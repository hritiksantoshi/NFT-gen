const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = new Schema({
    firstName: {
        type: String, default: ''
    },
    lastName: {
        type: String, default: ''
    },
    email: {
        type: String, index: true, required: true
    },
    mobileNumber: {
        type: String, required: true
    },
    password: {
        type: String, index: true, required: true
    },
  
},{timestamps:true});

module.exports = mongoose.model('users', UserModel);