const moment = require('moment');

const Admin = require('../../../models/admin');
const OTP = require('../../../models/otp');

const OTPService = require("../otp/OTPService");
const EmailService = require("../otp/emailService");

exports.otpSendService = async (email) => {

    try {

        let admin = await Admin.aggregate([
            {
                '$match': {
                    'email': email
                }
            }
        ]);

        if (admin[0] != undefined) {
            const OTPRecord = await OTP.findOne({ email: email });

            if (OTPRecord != null) {
                await EmailService.sendEmail(email, OTPRecord.OTP, moment(OTPRecord.createdAt).format('DD/MM/YYYY HH:mm:ss'));
            }
            else {

                const OTP = await OTPService.OTPGenerator(email);

                if (OTP.status)
                    await EmailService.sendEmail(email, OTP.response.OTP, moment(OTP.response.createdAt).format('DD/MM/YYYY HH:mm:ss'));
                else
                    throw new Error(OTP.message);
            }
        }
        else {
            throw new Error("Email Id not registered with us, Please contact Holmium Technologies!");
        }

        return { status: true, message: "OTP is successfully send on your email Id" };
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