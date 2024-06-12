const express = require('express');
const Photographer = require('../controllers/photographersController');
const upload = require('../middlewares/multer');

const router = express.Router();

router.get('/get-all/:eventId', Photographer.getPhotographerController)
router.get('/get/:photographerId', Photographer.getSinglePhotographerController)

router.post('/create', Photographer.createPhotographerController)
router.put('/update', Photographer.updatePhotographerController)
router.get('/delete/:eventId', Photographer.deletePhotographerController)

router.get('/getphotos/:eventId/:photographerId', Photographer.getPhotosController)

router.post('/upload', upload, Photographer.photoUploadController)



module.exports = router;