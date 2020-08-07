const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const password = require('password-hash-and-salt');
const removeFolder = require('../../Modules/FileFolders/removeFolder');

//requirements: email, password
route.post('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running removeUser");
  const email = req.body.email;
  const unhashedPassword = req.body.password;

  const Account = await User.findOne({ email });
  if (!Account) return res.status(400).json({ message: "There was an issue deleting your account" });
  password(unhashedPassword).verifyAgainst(Account.password, async (err, verified) => {
    if (err) {
      res.status(400).json({ message: "There was an error retriving your accout." });
      throw new Error("There was an error retriving your account. It could not be deleted");
    }
    if (!verified) {
      res.status(401).json({ message: "There was an error retriving your account." });
    } else {
      await removeFolder(Account.fileDirectory);
      await Account.delete(err => {
        if (err) return res.status(400).json({ message: "There was an error deleting your account" });
      });
      res.status(200).json({ message: "Account has been succesfully removed" });
    }
  })
})

module.exports = route;