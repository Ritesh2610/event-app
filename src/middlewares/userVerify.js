//Import Model
const User = require('../models/user');

const userVerify = async (req, res, next) => {

    try {

        const username = req.query.username;

        const predefindUsername = ['useradmin@quiksy.com', 'superadmin@quiksy.com'];

        if (!predefindUsername.includes(username)) {
            const user = await User.find({ 'username': username });
            if (user[0] == undefined)
                throw new Error("User does not have access privileges for site monitoring, Please contact to Quiksy!");
            else
                next();
        }
        else
            next();
    }
    catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
}

module.exports = userVerify;