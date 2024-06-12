const User = require('../../../models/user');
const Session = require('../../../models/auth/session');

const OTPSendService = require('./verifyUserService');

exports.login = async (email) => {

    try {
        let user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("User Not found, Please contact to Quiksy!");
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