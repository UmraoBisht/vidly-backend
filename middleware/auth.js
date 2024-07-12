const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ status: 'failed', message: 'Access Denied. No Token Provided' });
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ status: 'failed', message: 'Invalid Token' });
    }
}