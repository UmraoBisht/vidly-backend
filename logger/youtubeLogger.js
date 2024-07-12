// const winston = require("winston");
require('winston-mongodb');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${level} ${timestamp} : ${message}`;
});


const youtubeLogger = () => {
    return createLogger({
        format: combine(
            timestamp(),
            myFormat
        ),
        transports: [
            new transports.Console(),
            // new transports.File({filename:'mongodb.log'}),
        ]
    });
}

module.exports = youtubeLogger;