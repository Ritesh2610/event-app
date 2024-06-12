const Photographer = require("../services/photographerServices/photographer");
const PhotoUpload = require("../services/photographerServices/photoUpload");

exports.getPhotographerController = (req, res) => {
    Photographer.getPhotographers(req.params.eventId).then((response) => {
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

exports.getSinglePhotographerController = (req, res) => {
    Photographer.getSinglePhotographer(req.params.photographerId).then((response) => {
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

exports.createPhotographerController = (req, res) => {
    Photographer.createPhotographer(req.body).then((response) => {
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

exports.updatePhotographerController = (req, res) => {
    Photographer.updatePhotographer(req.body).then((response) => {
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

exports.deletePhotographerController = (req, res) => {
    Photographer.deletePhotographer(req.params.photographerId).then((response) => {
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

exports.getPhotosController = (req, res) => {
    Photographer.getPhotos(req.params.eventId,req.params.photographerId).then((response) => {
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

exports.photoUploadController = (req, res) => {
    PhotoUpload.photoUpload(req.body.eventId,req.body.photographerId,req.files).then((response) => {
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
