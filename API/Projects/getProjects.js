const express = require('express');
const route = express.Router();
const Project = require('../../Models/Project');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');


//requirements: session, name
route.get('/', async (req, res) => {
  if(!req.headers['authorization']) return res.status(401).json({message: "You are not authorized"});
  console.log("Running getProject")
  if(req.query.project){
    const queryProjectString = req.query.project;
    const project = await Project.findOne({"_id": queryProjectString});
    if(!project) return res.status(204).json({message: "There was something wrong with returning the result"});
    res.status(200).json(
      {
        message: "Retrived project succesfully",
        project
      }
    )
  } else {
    const storage = sessionStorage();
    const userid = storage.getSession(req.headers['authorization']);
    if(!userid) return res.status(204).json({message: "There was something wrong with returning the result"});
    const projects = await Project.find({ "owner": userid });
    if(!projects) return res.status(204).json({message: "There was something wrong with returning the result"});
    res.status(200).json({ projects });
  }
});

module.exports = route;