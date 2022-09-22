const router = require('express').Router();
const controller = require('../controller')
router.post('/signup',controller.signup);
router.post('/login',controller.login);
router.post('/nftgen',controller.upload,controller.NFTgen);

module.exports = {router};