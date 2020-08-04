const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const Project = require('../../Models/Project');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');


//requirements: session, name
route.post('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running addProject");
  const storage = sessionStorage();
  const project = {};
  project.name = req.body.name;
  project.owner = storage.getSession(req.headers['authorization']);;
  const projectModel = new Project(project);
  projectModel.save(async (err, savedProjectObject) => {
    if (err) {
      console.log(err);
      res.json({ message: "There was an error adding your project" });
    } else {
      const Account = await User.findOne({ "_id": userId });
      Account.projects.push(projectModel.id);
      await Account.save((err, savedAccountObject) => {
        if(err) {
          console.log(err);
          res.status(400).json({ message: 'There was an error adding your project' });
          savedProjectObject.deleteOne({ "_id": savedAccountObject._id}, err => {
            console.log(err);
          })
        }
      });
      res.json({
        message: `Project ${project.name} has been added`,
        activeProject: savedAccountObject.id,
        project: {
          name: savedAccountObject.name,
          createdOn: savedAccountObject.createdOn,
          owner: savedAccountObject.createdBy,
          identifier: savedAccountObject.id
        }
      });
    }
  });
});

module.exports = route;