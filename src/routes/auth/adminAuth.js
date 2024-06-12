const express = require('express');
const router = express.Router();

const Login = require('../../controllers/auth/adminAuth/login');
const VerifyOTP = require("../../controllers/auth/adminAuth/verifyOtp")

router.post("/login", Login.login);
router.post("/verifyotp", VerifyOTP.verifyOTPController);

module.exports=router;