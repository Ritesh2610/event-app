const User = require("../services/userServices/user");

exports.getUserController = (req, res) => {
    User.getUsers(req.data).then((response) => {
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

exports.getSingleUserController = (req, res) => {
    User.getSingleUser(req.params.userId).then((response) => {
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

exports.createUserController = (req, res) => {
    User.createUser(req.body, req.data).then((response) => {
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

exports.updateUserController = (req, res) => {
    User.updateUser(req.body).then((response) => {
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

exports.deleteUserController = (req, res) => {
    User.deleteUser(req.params.userId, req.data).then((response) => {
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

