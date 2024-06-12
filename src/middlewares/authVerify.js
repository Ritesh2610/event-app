const jwt = require('jsonwebtoken');

const authVerify =(req, res, next) => {
    try {

        let token = req.headers.authorization.split(" ")[1];
        
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, tokendata) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized request' });
            }
            if (tokendata) {
                req.data = tokendata;
                next();
            }
        })
    } catch (error) {
        res.status(401).json({ message: 'Authentication Failed' });
    }
}

module.exports = authVerify;