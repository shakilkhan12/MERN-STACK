const jwt = require("jsonwebtoken");
const config = require('config')

module.exports = (req, res, next) => {
    // Get token from header

    const token = req.header(('auth-token'));
    // check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtsecret'));
        req.user = decoded.user;
        next()
    } catch (err) {
        console.log(err.message);
        res.status(401).json({ msg: 'Token is not valid' })
    }
}