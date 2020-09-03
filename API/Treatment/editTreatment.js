const express = require('express');
const route = express.Router();
const Project = require('../../Models/Project');
const addParagraph = require('../Paragraph/addParagraph');
const editParagraph = require('../Paragraph/editParagraph');
const getParagraph = require('../Paragraph/getParagraph');
const removeParagraph = require('../Paragraph/removeParagraph');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');
const update = require('../../Modules/FileFolders/update');

route.put('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running editTreatment");
  const storage = sessionStorage();
  const userid = storage.getSession(req.headers['authorization']);
  if (req.body.project) {
    const project = await Project.findOne({ "_id": req.body.project });
    if (project === null) return res.status(204).json({ message: "There was something wrong with returning the result" });
    const treatmentPath = `../../${project.fileDirectory}/treatment.json`;
    const treatment = require(treatmentPath);
    if (req.body.data) {
      let newTreatment;
      let status;
      if (req.body.data.method === 'add') {
        newTreatment = addParagraph(treatment);
        console.log(newTreatment);
        status = await update(`${project.fileDirectory}/treatment.json`, JSON.stringify(newTreatment, null, 2));
      }
      if (req.body.data.method === 'edit') {
        newTreatment = editParagraph(treatment, req.body.data);
        console.log(newTreatment);
        status = await update(`${project.fileDirectory}/treatment.json`, JSON.stringify(newTreatment, null, 2));
      }
      if (req.body.data.method === 'get') {
        getParagraph(treatment);
      }
      if (req.body.data.method === 'delete') {
        newTreatment = removeParagraph(treatment, req.body.data);
        console.log(newTreatment);
        status = await update(`${project.fileDirectory}/treatment.json`, JSON.stringify(newTreatment, null, 2));
      }
      if (status) {
        return res.status(200).json({
          message: "Treatment has been updated succesfully",
          treatment: newTreatment
        });
      }
      return res.status(405).json({ message: "There was something wrong with returning the result" });
    } else {
      return res.status(400).json({ message: "There was something wrong with returning the result" });
    }
  }
});


module.exports = route;