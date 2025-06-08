const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const controller = require('../controllers/commerceController');

//metodo post para /api/commerce/upload
router.post('/upload', upload.single('file'), controller.uploadCSV);

//metodo post para /api/commerce/process
router.post('/process', controller.processByDate);

//metodo get para /api/commerce/quarantine
router.get('/quarantine', controller.getQuarantine);

//metodo get para /api/commerce/registrosValidos
router.get('/valid-by-date', controller.getValidByDate);



module.exports = router;