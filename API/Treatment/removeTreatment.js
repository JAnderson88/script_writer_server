const express = require('express');
const route = express.Router();
const Treatment = require('../../Models/Treatment');
const remove = require('../../Modules/FileFolders/remove');

const removeTreatment = (treatmentId, jsonPath, authorization) => {
  if (!authorization) return;
  await remove(jsonPath, { type: "file" });
  const removedTreatment = await Treatment.removeOne({ "_id": treatmentId }, err => {
    if (err) {
      console.log(err);
      return {
        status: 400,
        message: `There was a problem deleting the project`
      }
    }
  });
  if(removedTreatment) return {
    status: 200,
    message: `Treatment has been succesfully removed`
  }
}

module.exports = removeTreatment;