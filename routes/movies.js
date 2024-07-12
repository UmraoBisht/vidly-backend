const express = require('express');
const Movies = require('../schemas/movies');
const { genresSchema, validateAllSchema } = require('../validators/moviesSchema');
const Genres = require('../schemas/genres');
const auth = require('../middleware/auth');
const router = express.Router();



router
    .get('/', async (req, res) => {
        try {
            const movies = await Movies.find();
            res.send(movies);
        } catch (error) {
            res.status(500).send(error.message);
        }
    })
    .get('/:genre', async (req, res) => {

        const { error } = genresSchema.validate({ genres: [req.params.genre] });
        if (error) return res.status(400).send(error.details[0].message);
        try {
            const filteredMovies = await Movies.find({ genres: req.params.genre });
            if (!filteredMovies) return res.status(404).send("Movies not found for given genre...!");
            res.send(filteredMovies);
        } catch (error) {
            console.log(error.message);
        }
    })

    .post('/create', auth, async (req, res) => {
        const { id, title, year, runtime, director, actors, plot, posterUrl, genreId, numberOfStocks } = req.body;
        const { error } = validateAllSchema.validate({ genres: genreId, title: title, year: year });
        if (error) return res.status(400).send(error.details[0].message);
        const genre = await Genres.findById(genreId);
        if (!genre) return res.status(400).json({ status: 'failed', message: 'genre not found' })

        const movie = {
            id,
            title,
            year,
            runtime,
            genres: {
                _id: genre.id,
                name: genre.name
            },
            numberOfStocks,
            director,
            actors,
            plot,
            posterUrl
        }
        try {
            const newMovie = await Movies.create(movie);
            console.log("Successfully Create Item");
            res.send(newMovie);
        } catch (error) {
            console.log(error.message);
            res.send(error)
        }
    })

    .put('/:id', auth, async (req, res) => {
        // validation
        const { genres, title, year, } = req.body;
        const { error } = validateAllSchema.validate({ genres: genres, title: title, year: year });
        if (error) return res.status(400).send(error.details[0].message);

        // Find Index


        try {
            const { matchedCount } = await Movies.updateOne({ id: +(req.params.id) }, { genres, title, year }, { new: true });
            if (!matchedCount) {
                return res.sendStatus(404);
            }
            console.log("Item Updated Successfully...");
            res.send(matchedCount);
        } catch (error) {
            console.log(error.message);
            res.send(error);
        }
    })
    .delete('/:id', auth, async (req, res) => {
        try {
            const { deletedCount } = await Movies.deleteOne({ id: +(req.params.id) });
            if (!deletedCount) return res.sendStatus(404);
            res.send(deletedCount);
        } catch (error) {
            console.log(error.message);
        }
    });


module.exports = router;