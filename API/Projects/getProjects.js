const express = require('express');
const route = express.Router();
const Project = require('../../Models/Project');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');


//requirements: session, name
route.get('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  const storage = sessionStorage();
  const userid = storage.getSession(req.headers['authorization']);
  if (!userid) return res.status(204).json({ message: "There was something wrong with returning the result" });
  if (req.query.project) {
    console.log("Running getProject")
    const queryProjectString = req.query.project;
    const project = await Project.findOne({ "_id": queryProjectString });
    if (!project) return res.status(204).json({ message: "There was something wrong with returning the result" });
    return res.status(200).json(
      {
        message: "Retrived project succesfully",
        project: {
          name: project.name,
          createdOn: project.createdOn,
          owner: project.createdBy,
          identifier: project.id,
          scriptType: project.scriptType,
          scriptOptions: project.scriptOptions
        }
      }
    )
  } else {
    console.log("Running getProjects")
    const projects = await Project.find({ "owner": userid });
    if (!projects) return res.status(204).json({ message: "There was something wrong with returning the result" });
    const projectsArray = projects.map(prjct => {
      return {
        name: prjct.name,
        createdOn: prjct.createdOn,
        owner: prjct.createdBy,
        identifier: prjct.id,
        scriptType: prjct.scriptType,
        scriptOptions: prjct.scriptOptions
      }
    })
    return res.status(200).json(
      {
        message: "Retrieved projects succesfully",
        projects: projectsArray
      }
    );
  }
});

module.exports = route;