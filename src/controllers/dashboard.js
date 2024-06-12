const Dashboard = require("../services/dashboard/get");

exports.getDashboardController = (req, res) => {
    Dashboard.getDashboard(req.data).then((response) => {
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

exports.getDashboardCurveController = (req, res) => {
    Dashboard.getDashboardCurve(req.data, req.query.timestamp, req.query.period).then((response) => {
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