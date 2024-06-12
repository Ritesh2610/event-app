const VerifyOTPService = require("../../../services/auth/adminAuth/verifyOTPService");

exports.verifyOTPController = async (req, res, next) => {

    try {
        let response = await VerifyOTPService.verifyOTPService(req.body.email, req.body.OTP);

        if (!response.status) {
            throw new Error(response.message);
        }

        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(401).json({
            status: false,
            message: err.message
        });
    }
}