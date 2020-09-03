const Treatment = require('../../Models/Treatment');

const addTreatment = async (projectId, jsonPath, authorization) => {
  if (!authorization) return;
  const treatment = {};
  treatment.project = projectId;
  treatment.location = jsonPath;
  const treatmentModel = new Treatment(treatment);
  await treatmentModel.save(err => {
    if(err) console.log(err);
  });
  return treatmentModel.id;
}

module.exports = addTreatment;