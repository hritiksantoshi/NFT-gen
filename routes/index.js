const router = require('express').Router();
const controller = require('../controller');
const {authorize} = require('../middlewares')
router.post('/signup',controller.signup);
router.post('/login',controller.login);
router.post('/nftgen',authorize(),controller.upload,controller.NFTgen);

module.exports = {router};