const Admin = require('../../../models/admin');
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
            const admin = await Admin.findOne({ email: email });

            const token = jwt.sign({ _id: admin._id, email: admin.email, userType: admin.userType }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

            const session = new Session({
                email: admin.email,
                token: token,
                from: moment()
            });

            await session.save()

            response.status = true;
            response['message'] = "Log In Successfully";
            response['token'] = token;
            response['username'] = admin.username;
            response['userType'] = admin.userType;
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