const express = require('express');
const Event = require('../controllers/eventsController');

const router = express.Router();

router.get('/get', Event.getEventController)
router.get('/get/:eventId', Event.getSingleEventController)
router.post('/create', Event.createEventController)
router.put('/update', Event.updateEventController)
router.get('/delete/:eventId', Event.deleteEventController)

module.exports = router;