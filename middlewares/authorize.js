const users = require('../models/users');
const universalFunction = require('../lib/universal-function');
const messageList = require("../messages/messages");
const messages = messageList.MESSAGES;

module.exports = function ( ) {
    return async (req, res, next) => {
        try {
            if (req.headers.authorization) {

                let accessToken = req.headers.authorization;

                if (accessToken.startsWith('Bearer')) {
                    [, accessToken] = accessToken.split(' ');
                };

                const decodedData = await universalFunction.jwtVerify(accessToken);
                let userData = await users.findById(decodedData._id, { password: 0 });

                if (userData) {
                        req.loggedUser = userData;
                        next();

                } else {

                    return universalFunction.forBiddenResponse(res, messages.INVALID_TOKEN);

                }

            } else {

                return universalFunction.unauthorizedResponse(res, messages.UNAUTHORIZED);

            }

        } catch (error) {

            return universalFunction.forBiddenResponse(res, messages.INVALID_TOKEN);

        }
    }
}
