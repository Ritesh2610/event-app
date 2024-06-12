const LoginService = require("../../../services/auth/userAuth/login");

exports.login = async (req, res, next) => {

    try {

        let response = await LoginService.login(req.body.email)

        if (!response.status) {
            throw new Error(response.message);
        }

        res.status(200).json(response);
    }
    catch (err) {
        console.log(err)
        res.status(401).json({
            message: err.message
        });
    }
};