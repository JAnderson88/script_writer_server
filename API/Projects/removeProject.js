const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const Project = require('../../Models/Project');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

route.delete('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running deleteProject");
  console.log(req.body);
  if (req.body.project) {
    await Project.deleteOne({ "_id": req.body.project }, (err, obj) => {
      console.log(obj);
      if (err) return res.status(400).json({ message: `There was a problem deleting the project` });
    });
    const storage = sessionStorage();
    const userid = storage.getSession(req.headers['authorization']);
    const Account = await User.findOne({ "_id": userid });
    console.log(Account.projects);
    const index = Account.projects.findIndex(element=> element === req.body.project);
    console.log(index);
    if(index !== -1) Account.projects.splice(index, 1);
    await Account.save(err => {
      if (err) return res.status(400).json({ message: `There was a problem deleting the project` });
    })
    res.status(200).json({ message: `Your project, ${req.body.name}, has been deleted` });
  }
});

module.exports = route;