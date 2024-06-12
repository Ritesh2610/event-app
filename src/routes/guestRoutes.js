const express = require('express');
const Guest = require('../controllers/guestsController');
const upload = require('../middlewares/multer');

const router = express.Router();

router.get('/details/:eventId', Guest.getDetailsController)
router.post('/selfie', upload, Guest.selfieUploadController)


module.exports = router;