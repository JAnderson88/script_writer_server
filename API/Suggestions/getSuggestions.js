const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const Suggestion = require('../../Models/Suggestion');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

//requirements session, projectid
route.get('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running getSuggestion");
  const storage = sessionStorage();
  const Account = await User.findOne({ "_id": storage.getSession(req.headers['authorization']) });
  if (!Account) return res.status(401).json({ message: "You are not authorized" });
  const suggestions = await Suggestion.find({ "project": req.query.project });
  if(!suggestions) return res.status(400).json({ message: 'There was an error retriving the suggestions'});
  res.json({
    message: 'Your suggestions were returned succesfully',
    suggestions: JSON.stringify(suggestions)
  });
});

module.exports = route;