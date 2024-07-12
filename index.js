require('colors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const config = require('config');
const { login, authenticate } = require('./middleware/logger');
const app = express();
const mongoose = require('mongoose');
const movies = require('./routes/movies');
const genres = require('./routes/genres');
const rentalRouter = require('./routes/rental');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const error = require('./middleware/error');
const logger = require('./logger/logger');
require('./db/connectdb')();
// const home=require('./routes/home'
require('dotenv');


// process.on('uncaughtException', (ex) => {
//     logger.error(ex.message);
//     process.exit(1)
// })

// new winston.ExceptionHandler(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

// process.on('unhandledRejection', (err) => {
//     logger.error(err.message);
//     process.exit(1)
// })

// const p = Promise.reject(new Error('something went worng miserably'));
// p.then(() => console.log('done'));

// throw new Error("Uncaught Error 2");

if (!config.get("jwtPrivateKey")) {
    console.error("Fatal Error:JsonWebToken is not defined");
    process.exit(1);
}

console.log('Application Name: ' + config.get('ApplicationName'));
console.log('Mail-Server-Host: ' + config.get('mail.host'));


// Environment
console.log(process.env.NODE_ENV);
console.log(app.get('env'));

// Custom Middlewares
app.use(login);
app.use(authenticate);

// Built-in Middlewares
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));


//setting Devlopment or Production Environment
if (app.get('env') === 'development') {
    logger.info('Morgan Enabled!');
}


// third-party Middlewares
app.use(morgan('tiny'));
app.use(helmet()); //Logger
app.use(cors());    //Add Cors Policies


//Adding Template Engine 
app.set('view engine', 'ejs');
app.set('views', './views'); //Default Path For Templates


// connectdb();
// mongoose.connect('mongodb://127.0.0.1/Netflix').then(() => {
//     logger.info("Mongodb Connected sucessfully...");
// }).catch((error) => {
//     console.log(error.message);
// });

// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/movies', movies);
app.use('/api/genres', genres);
app.use('/api/rentals', rentalRouter);

// error Handler
app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Listening on Port ${PORT}...🚀`.bgWhite.black);
});