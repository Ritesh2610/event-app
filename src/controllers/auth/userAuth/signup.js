const SignupService = require("../../../services/auth/userAuth/signup");

exports.signup = async (req, res, next) => {

    try {

        let response = await SignupService.signup(req.body)

        if (!response.status) {
            throw new Error(response.message);
        }

        res.status(200).json(response);
    }
    catch (err) {
        console.log(err)
        res.status(401).json({ message: err.message });
    }
};