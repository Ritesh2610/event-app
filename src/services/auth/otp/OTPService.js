//Import Packages
const otpGenerator = require('otp-generator')

//Import Model
const OTP = require("../../../models/otp");

exports.OTPGenerator = async (email) => {
    try {

        const otp = new OTP({
            email: email,
            OTP: otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            })
        })

        await otp.save();

        return { status: true, response: otp }
    }
    catch (err) {
        console.log(err);
        const response = {
            status: false,
            message: "Please try again after some time."
        }
        return response;
    }
};