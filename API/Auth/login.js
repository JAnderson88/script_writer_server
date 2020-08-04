const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const password = require('password-hash-and-salt');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');


//requirements: email, password
route.post('/', async (req, res) => {
  console.log("Running Login")
  const email = req.body.email;
  const unhashedPassword = req.body.password;
  const Account = await User.findOne({ email }, err => {
    if (err) res.status(401).json({ message: "There was an error with your credentials" });
  });
  password(unhashedPassword).verifyAgainst(Account.password, async (err, verified) => {
    if (err) {
      res.status(401).json({ message: "There was an error retriving your accout." });
      throw new Error("There was an error retriving your account. It could not be deleted");
    }
    if (!verified) {
      res.status(401).json({ message: "There was an error retriving your account." });
    } else {
      const storage = sessionStorage();
      const sessionKey = await storage.addSession(Account.id);
      res.status(200).json(
        {
          message: "You have been authenticated",
          sessionInfo: { email, session: sessionKey }
        }
      );
    }
  });
});

module.exports = route;