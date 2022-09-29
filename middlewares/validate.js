// const universalFunction = require("../lib/universal-function");

// module.exports = function () {

//     return function (req, res, next) {
//         if (schema.body) {
//             const { error, value } = schema.body.validate(req.body);
//             if (error) return universalFunction.validationError(res, error);
//             req.body = value;
//             next()
//         }
//     }
// }