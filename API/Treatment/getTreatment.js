const express = require('express');
const route = express.Router();
const Project = require('../../Models/Project');
const Treatment = require('../../Models/Treatment');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

//needed: session, project id 
route.get('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log(req.query);
  console.log("Running getTreatment")
  const storage = sessionStorage();
  const userid = storage.getSession(req.headers['authorization']);
  if (!userid) return res.status(204).json({ message: "There was something wrong with returning the result" });
  if (req.query.project) {
    const queryProjectString = req.query.project;
    const project = await Project.findOne({ "_id": queryProjectString });
    if (!project) return res.status(204).json({ message: "There was something wrong with returning the result" });
    const treatment = require(`../../${project.fileDirectory}/treatment.json`);
    if (!treatment) return res.status(204).json({ message: "There was something wrong with returning the result" });
    res.status(200).json({
      message: "Treatment returned succesfully",
      treatment: JSON.stringify(treatment)
    });
  }
});

module.exports = route;