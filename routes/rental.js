const express = require('express');
const Rentals = require('../schemas/rental');
const Genres = require('../schemas/genres');
const Movies = require('../schemas/movies');
const { default: mongoose } = require('mongoose');
const auth = require('../middleware/auth');
const rentalRouter = express.Router();


rentalRouter
    .get('/', async (req, res) => {
        try {
            const rentals = await Rentals.find().sort('-dateOut');
            res.json({ status: 'success', message: 'rentals successfully fetched', details: rentals });
        } catch (error) {
            res.status(500).json({ status: 'failed', message: 'Internal Server Error', details: error });
        }
    })
    .get('/:id', async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ status: 'failed', message: 'Invalid ID' });
            const rental = await Rentals.findById(req.params.id);
            res.json({ status: 'success', message: 'rental successfully fetched', details: rental });
        } catch (error) {
            res.status(500).json({ status: 'failed', message: 'Internal Server Error', details: error });
        }
    })
    .post('/create', auth, async (req, res) => {
        try {
            const genre = await Genres.findById(req.body.genreId);
            if (!genre) return res.json({ status: 'failed', message: 'genre not found for given id', details: genre });
            const movie = await Movies.findById(req.body.movieId);
            if (!movie) return res.json({ status: 'failed', message: 'movie not found for given id', details: movie });
            const rental = new Rentals(
                {
                    customer: {
                        name: "postman",
                        isGold: true,
                        phone: "243-335-4743",
                        email: "postman@post.com",
                    },
                    movies: {
                        title: movie.title,
                        dailyRentalRate: 50
                    },
                    dateOut: "2024-01-30"
                }
            );
            await rental.save();
            movie.numberOfStocks--;
            await movie.save();
            res.json({ status: 'success', message: 'rentals successfully created', details: rental });
        } catch (error) {
            res.status(500).json({ status: 'failed', message: 'Internal Server Error', details: error });
        }
    })
    .put('/:id', auth, async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ status: 'failed', message: 'Invalid ID' });
            const { customer, movies, dateOut } = req.body;
            const updatedRental = await Rentals.findByIdAndUpdate(req.params.id,
                {
                    customer, movies, dateOut
                }
                , { new: true });
            if (!updatedRental) return res.json({ status: 'failed', message: 'rental not found', details: updatedRental });
            res.json({ status: 'success', message: 'rentals successfully updated', details: updatedRental });
        } catch (error) {
            res.status(500).json({ status: 'failed', message: 'Internal Server Error', details: error });
        }

    })
    .delete('/:id', auth, async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ status: 'failed', message: 'Invalid ID' });
            const deletedRental = await Rentals.findByIdAndDelete(req.params.id);
            if (!deletedRental) return res.json({ status: 'failed', message: 'rental not found', details: deletedRental });
            res.json({ status: 'success', message: 'rentals successfully deleted', details: deletedRental });
        } catch (error) {
            res.status(500).json({ status: 'failed', message: 'Internal Server Error', details: error });
        }
    });

module.exports = rentalRouter;



// _id: 65b92ad4ca5e802da2e2783e
// 12 bytes
// 4 bytes :timestamp
// 3 byte :machine identifier
// 2 byte: process identifier
// 3 byte: counter

// driver => mongoDB