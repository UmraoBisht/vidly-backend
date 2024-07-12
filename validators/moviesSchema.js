const Joi = require('joi');

const validateAllSchema = Joi.object({
    title: Joi.string().min(3).required(),
    year: Joi.number().required(),
    genres: Joi.string().required(),
})

const genresSchema = Joi.object({
    genres: Joi.string().required(),
});

module.exports = { validateAllSchema, genresSchema };