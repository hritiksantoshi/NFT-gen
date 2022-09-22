const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const statusCodeList = require("../statusCodes/statusCodes");
const messageList = require("../messages/messages");
const messages = messageList.MESSAGES;
const statusCode = statusCodeList.STATUS_CODE;

const hashPasswordUsingBcrypt = async (plainTextPassword) => {
	const saltRounds = 10;
	return bcrypt.hashSync(plainTextPassword, saltRounds);
};
const jwtSign = async (payload) => {
	return jwt.sign({ _id: payload._id }, config.JWTSECRETKEY, { expiresIn: "1d" });
};

const jwtVerify = async (token) => {
	return jwt.verify(token, config.JWTSECRETKEY);
};

const comparePasswordUsingBcrypt = async (plainTextPassword, hashedPassword) => {
	return bcrypt.compareSync(plainTextPassword, hashedPassword);
};

const sendResponse = async (res, code, message, data) => {
	code = code || statusCode.SUCCESS;
	message = message || messages.SUCCESS;
	data = data || {};
	return res.status(code).send({
		statusCode: code,
		message: message,
		data: data
	});
};

const errorResponse = async (res, error) => {
	const code = statusCode.INTERNAL_SERVER_ERROR;
	console.log(error.stack);
	return res.status(code).send({
		statusCode: code,
		message:messages.SERVER_ERROR
	});
};
module.exports = {
    errorResponse: errorResponse,
    sendResponse: sendResponse,
	hashPasswordUsingBcrypt: hashPasswordUsingBcrypt,
    jwtSign: jwtSign,
	jwtVerify: jwtVerify,
    comparePasswordUsingBcrypt:comparePasswordUsingBcrypt
}