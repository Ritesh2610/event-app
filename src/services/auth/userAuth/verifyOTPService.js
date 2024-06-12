const User = require('../../../models/user');
const OTP = require('../../../models/otp');
const moment = require('moment');

const jwt = require('jsonwebtoken');
const Session = require('../../../models/auth/session');

exports.verifyOTPService = async (email, OTPValue) => {

    try {

        let response = {
            status: false
        };

        const OTPRecord = await OTP.aggregate([
            {
                '$match': {
                    'email': email,
                    'OTP': Number(OTPValue)
                }
            }
        ]);

        if (OTPRecord[0] != undefined) {

            await OTP.deleteOne({ _id: OTPRecord[0]._id });
            let user = await User.findOne({ email: email });

            const token = jwt.sign({ userId: user._id, email: user.email, userType: user.userType }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

            const session = new Session({
                email: user.email,
                token: token,
                from: moment()
            });

            await session.save()

            response.status = true;
            response['message'] = "Log In Successfully";
            response['token'] = token;
            response['userId'] = user._id;
            response['username'] = user.username;
            response['userType'] = user.userType;
            // response['quantity'] = null;
            // response['expiresIn'] = 86400;
            // response['subscription'] = [];

        }
        else {
            throw new Error("OTP is incorrect or expired, Please try again");
        }

        return response;
    }
    catch (err) {
        console.log(err);
        const response = {
            status: false,
            message: err.message
        }
        return response;
    }
}