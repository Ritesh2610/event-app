const Guest = require("../services/guestServices/guest");
const SelfieUpload = require("../services/guestServices/selfieUpload");

exports.getDetailsController = (req, res) => {
    Guest.getDetails(req.params.eventId).then((response) => {
        if (!response.status) {
            throw new Error(response.data.message);
        }
        res.status(200).json({
            status: response.status,
            response: response.data
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(401).json({
            status: false,
            message: err.message
        })
    })     
}

exports.selfieUploadController = (req, res) => {
    SelfieUpload.selfieUpload(req.body.eventId, req.files).then((response) => {
        if (!response.status) {
            throw new Error(response.data.message);
        }
        res.status(200).json({
            status: response.status,
            response: response.data
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(401).json({
            status: false,
            message: err.message
        })
    })     
}
