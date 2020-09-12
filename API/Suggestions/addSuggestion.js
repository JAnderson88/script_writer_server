const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const Suggestion = require('../../Models/Suggestion');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

//requirements session, projectid, paragraphid, classification, data
route.post('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running addSuggestion");
  console.log(req.body);
  const storage = sessionStorage();
  const Account = User.findOne({ "_id": storage.getSession(req.headers['authorization']) });
  if (!Account) return res.status(401).json({ message: "You are not authorized" });
  const data = JSON.parse(req.body.data);
  const suggestion = {};
  suggestion.project = req.body.project;
  suggestion.paragraph = data.paragraph;
  suggestion.classification = data.classification;
  suggestion.data = data.data;
  const suggestionModel = new Suggestion(suggestion);
  await suggestionModel.save(async (err, savedSuggestionModel) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: 'There was an error adding your project' });
    }
  });
  res.status(200).json({
    message: `Your suggestion has been added`,
    suggestion
  });
});

module.exports = route;