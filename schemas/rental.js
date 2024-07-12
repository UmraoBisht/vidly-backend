const mongoose = require('mongoose');
const rentalSchema = new mongoose.Schema({

    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                mixlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /\d{3}-\d{3}-\d{4}/.test(v);
                    },
                    message: props => `${props.value} is not a valid phone number!`
                }
            },
            email: {
                type: String,
            }
        }),
        required: true
    },
    movies: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 50
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 500
            }
        }),
        required: true
    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturn: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rentals = mongoose.model('Rentals', rentalSchema);
module.exports = Rentals;