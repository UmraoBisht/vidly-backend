const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://127.0.0.1/Netflix').then(() => {
        console.log("Mongodb Connected sucessfully...");
    }).catch((error) => {
        console.log(error.message);
    });
}

