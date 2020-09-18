const express = require('express');
const route = express.Router();
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

route.post('/', async (req, res) => {
  console.log("Running Logout")
  if (!req.body.session) return res.status(200).json({ message: "No user to log out" });
  const storage = sessionStorage();
  const session = JSON.parse(req.body.session).session;
  storage.deleteSession(session, (err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ message: "There was an error logging the user out" })
    }
  });
  return res.status(200).json({ message: "User has been succesfully logged out" });

});

module.exports = route;