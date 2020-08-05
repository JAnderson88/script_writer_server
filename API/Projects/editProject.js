const express = require('express');
const route = express.Router();
const Project = require('../../Models/Project');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

route.post('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running editProject");
  if (req.body.project) {
    const storage = sessionStorage();
    const userid = storage.getSession(req.headers['authorization']);
    if (!userid) return res.status(204).json({ message: "There was something wrong with editing your project" });
    const project = await Project.findOne({ "_id": req.body.project });
    if (!project) return res.status(204).json({ message: "There was something wrong with returning the result" });
    if (project.name !== req.body.data.name) project.name = req.body.data.name;
    if (project.owner !== req.body.data.createdBy) project.createdBy = req.body.data.owner;
    if (project.scriptType !== req.body.data.scriptType) project.scriptType = req.body.data.scriptType;
    if (project.scriptOptions !== req.body.data.scriptOptions) project.scriptOptions = req.body.data.scriptOptions;
    project.editedOn = Date.now();
    await project.save(err => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: 'There was a problem updated the project' });
      } else {
        res.status(200).json({ message: 'Updated project succesfully' });
      }
    })
  } else {
    res.status(400).json({ message: 'There was a problem updated the project' });
  }
})

module.exports = route;