const express = require('express');
const router = express.Router();

const Login = require('../../controllers/auth/userAuth/login');
const Signup = require('../../controllers/auth/userAuth/signup');
// const VerifyUser = require("../../controllers/auth/verifyUser");
const VerifyOTP = require("../../controllers/auth/userAuth/verifyOtp")

// const authVerify = require("../../middlewares/authVerify")

router.post("/login", Login.login);
router.post("/signup", Signup.signup);
// router.use("/verifyuser", authVerify, VerifyUser.verifyUserController);
router.post("/verifyotp", VerifyOTP.verifyOTPController);

module.exports=router;