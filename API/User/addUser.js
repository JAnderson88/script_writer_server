const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const password = require('password-hash-and-salt');
const create = require('../../Modules/FileFolders/create');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

//requirements: email, password
route.post('/', async (req, res) => {
  console.log("Adding User");
  const email = req.body.email;
  const unhashedPassword = req.body.password;
  const emailExists = await User.findOne({ email });
  if (emailExists) return res.status(409).json({ response: "An account already exists for this email" });
  let user = {};
  user.email = email;
  password(unhashedPassword).hash(async (err, hash) => {
    if (err) {
      console.log(err);
      res.status(409).json({ message: "There was an issue with creating your account" });
      throw new Error('Something went wrong while decrypting the password');
    }
    user.password = hash;
    let userModel = new User(user);
    const firstLetter = email.substring(0, 1).toUpperCase();
    const path = `./Files/${firstLetter}`;
    const fileDirectory = await create(path, userModel.id, { type: 'folder' });
    userModel.fileDirectory = fileDirectory;
    await userModel.save(err => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "There was an issue with creating your account" });
      }
    });
    const storage = sessionStorage();
    const sessionKey = await storage.addSession(userModel._id);
    return res.status(200).json({
      message: "You have been authenticated",
      sessionInfo: { email, session: sessionKey }
    });
  });
});

module.exports = route;