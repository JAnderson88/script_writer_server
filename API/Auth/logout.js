const express = require('express');
const route = express.Router();
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

route.post('/', (req, res) => {
  console.log("Running Logout")
  if (req.body.session) {
    const storage = sessionStorage();
    const session = JSON.parse(req.body.session).session;
    storage.deleteSession(session, (err) => {
      if(err) {
        console.log(err)
        return res.status(400).json({message: "There was an error logging the user out"})
      }
    });
    res.json({ message: "User has been succesfully logged out" });
  } else {
    res.json({ message: "No user to log out" });
  }
});

module.exports = route;