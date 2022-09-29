const router = require('express').Router();
const controller = require('../controller');
const {authorize} = require('../middlewares');
const upload = require('../services/upload');
const swaggerDocument = require('../swagger.json')
router.post('/signup',controller.signup);
router.post('/login',controller.login);
router.post('/createCollection',authorize(),controller.createCollection);
router.post('/addLayer',authorize(),controller.addLayers);
router.post('/upload',authorize(),upload.NFtimg,controller.uploadImges);
router.post('/generateNFT',authorize(),controller.generateNFT);
router.post('/nftgen',authorize(),controller.upload,controller.NFTgen);
router.get('/api-docs/swagger',(req, res) => res.json(swaggerDocument))

module.exports = router;