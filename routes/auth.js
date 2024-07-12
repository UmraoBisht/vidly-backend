const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../schemas/users');

authRouter
    .post('/login', async (req, res, next) => {
        try {
            const user = await Users.findOne({ email: req.body.email });
            if (!user) return res.status(400).json({ status: 'failed', message: 'user not exist' });
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(400).json({ status: 'failed', message: 'invlaid email or password' });
            const token = user.generateAuthToken();
            res.json({ status: 'success', message: 'user logged successfully', token: token });
        } catch (e) {
            next();
        }
    });

module.exports = authRouter;