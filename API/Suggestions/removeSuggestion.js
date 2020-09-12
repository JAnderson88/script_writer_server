const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const Suggestion = require('../../Models/Suggestion');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');
const { remove } = require('../../Models/User');

//requirements session, projectid, charachteristics, data
route.delete('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running removeSuggestion");
  const storage = sessionStorage();
  const Account = await User.findOne({ "_id": storage.getSession(req.headers['authorization']) });
  if (!Account) return res.status(401).json({ message: "You are not authorized" });
  const removeSuggetion = await Suggestion.remove({ "_id": req.body.data.id}, { justOne: true });
  if (!removeSuggetion) return res.status(401).json({ message: "You are not authorized" });
  return res.status(200).json({ message: "The suggestion was removed" });
});

module.exports = route;
