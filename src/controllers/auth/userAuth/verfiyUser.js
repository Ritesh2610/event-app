const OtpSendService = require("../../../services/auth/userAuth/verifyUserService");

exports.verifyUserController = async (req, res, next) => {

    try {
        let response = await OtpSendService.otpSendService(req.body.email);

        if (!response.status) {
            throw new Error(response.message);
        }

        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(401).json({
            status: false,
            message: err.message
        });
    }
}