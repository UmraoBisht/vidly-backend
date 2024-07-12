const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({

    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    year: { type: Number, validate: { validator: (value) => value >= 1980, message: "Movies before 1980s not allowed.." } },
    runtime: String,
    genres: [],
    numberOfStocks: Number,
    director: String,
    actors: {
        type: Array, required: true,
        validate: { validator: (actors) => actors && actors.length > 1, message: "Enter valid Actor Names.." }
    },
    plot: { type: String, minLength: 10 },
    posterUrl: String

});

const Movies = mongoose.model("Movies", movieSchema);
module.exports = Movies;