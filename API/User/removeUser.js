const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const password = require('password-hash-and-salt');

//requirements: email, password
route.post('/', async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const unhashedPassword = req.body.password;

    const Account = await User.findOne({email});
    if(Account) {
        password(unhashedPassword).verifyAgainst(Account.password, (err, verified) => {
            if(err) {
                res.json({message: "There was an error retriving your accout."});
                throw new Error("There was an error retriving your account. It could not be deleted");
            }
            if(!verified){
                res.json({message: "There was an error retriving your account."});
            } else {
                const removedAccount = Account.delete();
                res.json({message: "Account has been succesfully removed"});
            }
        })
    } else {
        return res.json({message: "This user does not exist"})
    }
})

module.exports = route;