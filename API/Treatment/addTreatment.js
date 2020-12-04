const Treatment = require('../../Models/Treatment');

const addTreatment = async (projectId, jsonPath, authorization) => {
  if (!authorization) return;
  const treatment = {};
  treatment.project = projectId;
  treatment.location = jsonPath;
  const treatmentModel = new Treatment(treatment);
  const treatmentConfirmation = await treatmentModel.save();
  if (!treatmentConfirmation) return false;
  return treatmentModel.id;
}

module.exports = addTreatment;