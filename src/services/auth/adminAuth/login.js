const Admin = require('../../../models/admin');

const OTPSendService = require('./verifyUserService');

exports.login = async (email) => {

    try {
        let admin = await Admin.findOne({ email: email });

        if (!admin) {
            throw new Error("Admin Not found, Please contact to Quiksy!");
        }
        else {
         const response = await OTPSendService.otpSendService(email)

         return response;
        }
    }
    catch (err) {
        console.log(err);
        const response = {
            status: false,
            message: err.message
        }
        return response;
    }
};