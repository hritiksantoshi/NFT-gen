const Model = require('../models');
const statusCodeList = require("../statusCodes/statusCodes");
const messageList = require("../messages/messages");
const messages = messageList.MESSAGES;
const statusCodes = statusCodeList.STATUS_CODE;
const universalFunction = require('../lib/universal-function');

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