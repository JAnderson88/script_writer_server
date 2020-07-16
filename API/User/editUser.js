const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const password = require('password-hash-and-salt');

//requirements: email, password
route.post('/', async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const newUnhashedPassword = req.body.password;

    const Account = await User.findOne({email})
    // console.log(Account);
    if(Account) {
        password(newUnhashedPassword).hash((err, hash) => {
            if (err) {
                res.json({response: 'Something went wrong'})
                throw new ('Something went wrong')
            }
            Account.password = hash;
            Account.save();
            res.json("Account has been saved");
        });
    } else {
        res.json({response: 'Could not find account'});
    }
});

module.exports = route;