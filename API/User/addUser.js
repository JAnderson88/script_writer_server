const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const password = require('password-hash-and-salt');

//requirements: email, password
route.post('/', async (req, res) => {
  console.log("Adding User");
  const email = req.body.email;
  const unhashedPassword = req.body.password;
  const emailExists = await User.findOne({ email });
  if (emailExists) return res.status(409).json({ response: "An account already exists for this email" });
  let user = {};
  user.email = email;
  password(unhashedPassword).hash((err, hash) => {
    if (err) {
      console.log(err);
      res.status(409).json({ message: "There was an issue with creating your account" });
      throw new Error('Something went wrong while decrypting the password');
    }
    user.password = hash;
    let userModel = new User(user);
    userModel.save(err => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "There was an issue with creating your account" })
      } else {
        res.status(200).json({ message: "Your user account has been created" });
      }
    });
  });
});

module.exports = route;