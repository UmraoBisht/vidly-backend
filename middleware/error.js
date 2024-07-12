const winston = require("winston");

module.exports = (err, req, res, next) => {
    // console.log(err);
    winston.log('error', err.message);
    winston.error(err.message, err);

 

    // error: 0,
    // warn: 1,
    // info: 2,
    // http: 3,
    // verbose: 4,
    // debug: 5,
    // silly: 6

    res.status(500).json({ status: 'failed', message: 'internal server error' });
}