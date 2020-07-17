const express = require('express');
const route = express.Router();

route.post('/', (req, res) => {
  if(req.session) {
    req.session.destroy();
    res.json({message: "User has been succesfully logged out"});
  } else {
    return res.json({message: "No user to log out"});
  }
});

module.exports = route;