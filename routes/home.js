const router = require('express').Router();
const { movies } = require('../movies-genres').info;

router.get('/', (req, res) => {
    res.render('home', { movies: movies });
});

module.exports = router;