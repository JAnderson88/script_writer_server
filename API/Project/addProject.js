const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const Project = require('../../Models/Project');
const addTreatment = require('../../API/Treatment/addTreatment');
const addTimeline = require('../Timeline/addTimeline');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');
const create = require('../../Modules/FileFolders/create');

//requirements: session, name
route.post('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running addProject");

  //initiate sesson check
  const storage = sessionStorage();
  const userid = storage.getSession(req.headers['authorization']);
  if (!userid) return res.status(204).json({ message: "There was something wrong with returning the result" });

  //Find account that the project it will be attached to
  const Account = await User.findOne({ _id: userid });
  if (!Account) return res.status(400).json({ message: 'There was an error adding your project' });

  //Check if this Project name exists for this user
  const projectNameExists = await Project.findOne({ owner: userid, name: req.body.name });
  if (projectNameExists !== null) return res.status(400).json({ message: 'There was an error adding your project' });

  //begin projectModel setup
  const project = {};
  project.name = req.body.name;
  project.owner = userid;

  //create project & save initial project
  const projectModel = new Project(project);
  await projectModel.save();
  // console.log(projectModel);

  //Initiate file structure setup for project
  const time = Date.now();
  const fileDirectory = await create(Account.fileDirectory, projectModel.id,
    {
      type: 'folder'
    }
  );
  if (!fileDirectory) return res.status(400).json({ message: 'There was an error adding your project' });

  //--Creating Treatment
  projectModel.fileDirectory = fileDirectory;
  const treatmentPath = await create(projectModel.fileDirectory, 'treatment.json',
    {
      type: 'file',
      data:
      {
        "project": projectModel._id,
        "createdOn": time,
        "editedOn": time,
        "paragraphs": []
      }
    });
  const treatmentId = await addTreatment(projectModel.id, treatmentPath, storage.checkIfKeyExists(req.headers['authorization']));
  if (!treatmentId) return res.status(400).json({ message: 'There was an error adding your project' });
  projectModel.treatment = treatmentId;

  //--Creating Timeline
  const timelineId = await addTimeline(projectModel, storage.checkIfKeyExists(req.headers['authorization']));
  if (!timelineId) return res.status(400).json({ message: 'There was an error adding your project' });
  projectModel.timeline = timelineId;

  //--Creating Characters
  await create(projectModel.fileDirectory, 'charachters.json', { type: 'file' });

  //--Creating Script
  await create(projectModel.fileDirectory, 'Script', { type: 'folder' });

  //save project
  await projectModel.save(async (err, savedProjectObject) => {
    if (err) {
      console.log(err);
      res.json({ message: "There was an error adding your project" });
    } else {
      Account.projects.push(projectModel.id);
      await Account.save(err => {
        if (err) {
          console.log(err);
          res.status(400).json({ message: 'There was an error adding your project' });
          savedProjectObject.deleteOne({ "_id": projectModel.id }, err => {
            console.log(err);
          });
          return;
        }
      });
      return res.json({
        message: `Project ${project.name} has been added`,
        activeProject: savedProjectObject.id,
        project: {
          name: savedProjectObject.name,
          createdOn: savedProjectObject.createdOn,
          owner: savedProjectObject.createdBy,
          identifier: savedProjectObject.id,
          scriptType: savedProjectObject.scriptType,
          scriptOptions: savedProjectObject.scriptOptions
        }
      });
    }
  });
});

module.exports = route;