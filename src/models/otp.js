const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true },
    OTP: { type: Number },
    createdAt: { type: Date, default: Date.now }
}, 
{ 
    timestamps: true 
});

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;