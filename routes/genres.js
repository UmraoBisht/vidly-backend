const express = require('express');
const Genres = require('../schemas/genres');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();



router
    .get('/', async (req, res) => {
        throw new Error("could not get genres");
        const genres = await Genres.find();
        res.json({ status: 'success', message: 'genres fetched successfully', data: genres });

    })
    .get('/:id', async (req, res) => {
        try {
            const genre = await Genres.findById(req.params.id);
            if (!genre) return res.status(404).json({ status: 'failed', message: 'genre not found' });
            res.json({ status: 'success', message: 'genre fetched successfully', data: genre });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ status: 'failed', message: 'internal server error' });
        }
    })
    .post('/create', auth, async (req, res) => {
        try {
            const genre = new Genres({
                name: req.body.name
            });
            await genre.save();
            res.json({ status: 'success', message: 'genre created successfully', data: genre });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'failed', message: 'internal server error' });
        }
    })
    .put('/:id', auth, async (req, res) => {
        try {
            const genre = await Genres.findByIdAndUpdate(req.params.id, {
                name: req.body.name
            }, { new: true });
            if (!genre) return res.status(404).json({ status: 'failed', message: 'genre not found' });
            res.json({ status: 'success', message: 'genre updated successfully', data: genre });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'failed', message: 'internal server error' });
        }
    })
    .delete('/:id', [auth, admin], async (req, res) => {
        try {
            const deletedGenre = await Genres.findByIdAndDelete(req.params.id);
            if (!deletedGenre) return res.status(404).json({ status: 'failed', message: 'genre not found' });
            res.json({ status: 'success', message: 'genre deleted successfully', data: deletedGenre });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'failed', message: 'internal server error' });
        }
    });

module.exports = router