const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const password = require('password-hash-and-salt');

//requirements: email, password
route.post('/', async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const unhashedPassword = req.body.password

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.json({ response: "An account already exists for this email" });
  }
  let user = {}
  user.email = email;
  password(unhashedPassword).hash((err, hash) => {
    if (err) {
      console.log(err);
      throw new Error('Something went wrong')
    }

    user.password = hash;
    let userModel = new User(user)
    userModel.save(err => {
      if (err) {
        console.log(err);
        res.json({ err })
      } else {
        res.json(userModel)
      }
    });
  });
});

module.exports = route;