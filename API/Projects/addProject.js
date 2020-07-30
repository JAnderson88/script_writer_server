const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const Project = require('../../Models/Project');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');


//requirements: session, name
route.post('/', async (req, res) => {
  console.log(req.body);
  const storage = sessionStorage();
  const userId = storage.getSession(req.headers['authorization']);
  const name = req.body.name;
  const project = {};
  project.name = name;
  project.owner = userId;
  console.log(project);
  let projectModel = new Project(project);
  console.log(projectModel.id);
  projectModel.save(async err => {
    if (err) {
      console.log(err);
      res.json({err});
    } else {
      const Account = await User.findOne({_id: userId});
      Account.projects.push(projectModel.id);
      const updatedAccount = await Account.save();
      res.json({
        message: `Project ${project.name} has been added`,
        activeProject: projectModel.id,
        project
      });
    }
  });
});

module.exports = route;