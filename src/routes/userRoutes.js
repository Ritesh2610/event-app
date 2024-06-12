const express = require('express');
const User = require('../controllers/usersController');

const router = express.Router();

router.get('/get', User.getUserController)
router.get('/get/:userId', User.getSingleUserController)
router.post('/create', User.createUserController)
router.put('/update', User.updateUserController)
router.get('/delete/:userId', User.deleteUserController)

module.exports = router;