const express = require('express');
const _ = require('lodash');
const Users = require('../schemas/users');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth'); //auth represents here authorization not authentication

userRouter
    .get('/me', auth, async (req, res) => {
        const user = await Users.findById(req.user._id).select('-password');
        res.json(user);
    })
    .post('/register', async (req, res) => {
        try {
            const user = await Users.findOne({ email: req.body.email });
            if (user) return res.status(400).json({ status: 'failed', message: 'user already exist' });
            // const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, 12);
            const { name, email, isAdmin } = req.body;
            const newUser = await Users.create({ name, email, password: hashPassword, isAdmin });
            const token = newUser.generateAuthToken();
            res.setHeader('x-auth-token', token).json({ status: 'success', message: 'user created successfully', data: newUser });
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: 'failed', message: 'internal server error' });
        }
    });

module.exports = userRouter;