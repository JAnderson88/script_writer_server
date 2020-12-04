const express = require('express');
const route = express.Router();
const User = require('../../Models/User');
const Project = require('../../Models/Project');
const removeTimeline = require('../Timeline/removeTimeline');
const removeTreatment = require('../Treatment/removeTreatment');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');
const remove = require('../../Modules/FileFolders/remove');

route.delete('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running deleteProject");
  const storage = sessionStorage();
  const userid = storage.getSession(req.headers['authorization']);
  const Account = await User.findOne({ "_id": userid });
  const project = await Project.findOne({ "_id": req.body.project });
  if (req.body.project) {
    //remove File Directory for project
    const fileConfirmation = await remove(`${Account.fileDirectory}/${req.body.project}`, { type: 'folder' });
    console.log(fileConfirmation);
    if (!fileConfirmation) return res.status(400).json({ message: `There was a problem deleting the project` });
    //remove Timeline from database
    const timelineConfirmation = await removeTimeline(project.timeline, storage.checkIfKeyExists(req.headers['authorization']));
    console.log(timelineConfirmation);
    console.log(timelineConfirmation.message);
    if (timelineConfirmation.status === 400) return res.status(400).json({message: timelineConfirmation.message});
    //remove Treatment from database
    const treatmentConfirmation = await removeTreatment(project.timeline, storage.checkIfKeyExists(req.headers['authorization']));
    console.log(treatmentConfirmation.message);
    if (treatmentConfirmation.status === 400) return res.status(400).json({message: treatmentConfirmation.message});
    //remove Project
    const projectDeleteConfirmation = await Project.remove({ "_id": req.body.project }, (err, obj) => {
      if (err) return res.status(400).json({ message: `There was a problem deleting the project` });
    });
    if(!projectDeleteConfirmation) return res.status(400).json({ message: `There was a problem deleting the project` });
    const index = Account.projects.findIndex(element => element === req.body.project);
    if (index !== -1) Account.projects.splice(index, 1);
    await Account.save(err => {
      if (err) return res.status(400).json({ message: `There was a problem deleting the project` });
    })
    res.status(200).json({ message: `Your project, ${project.name}, has been deleted` });
  }
});

module.exports = route;