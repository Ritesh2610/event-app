const Event = require("../services/eventServices/event");

exports.getEventController = (req, res) => {
    Event.getEvents().then((response) => {
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

exports.getSingleEventController = (req, res) => {
    Event.getSingleEvent(req.params.eventId).then((response) => {
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

exports.createEventController = (req, res) => {
    Event.createEvent(req.body).then((response) => {
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

exports.updateEventController = (req, res) => {
    Event.updateEvent(req.body).then((response) => {
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

exports.deleteEventController = (req, res) => {
    Event.deleteEvent(req.params.eventId).then((response) => {
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

