const express = require('express');
const Dashboard = require('../controllers/dashboard');

const router = express.Router();

router.get('/card', Dashboard.getDashboardController)
router.get('/curve', Dashboard.getDashboardCurveController)

module.exports = router;