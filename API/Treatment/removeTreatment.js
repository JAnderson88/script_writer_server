const Treatment = require('../../Models/Treatment');
const remove = require('../../Modules/FileFolders/remove');

const removeTreatment = async (treatmentId, authorization) => {
  if (!authorization) return;
  console.log("Passed authorization");
  // await remove(jsonPath, { type: "file" });
  const removedTreatment = await Treatment.remove({ "_id": treatmentId }, err => {
    if (err) {
      console.log(err);
      console.log("Error removing treatment");
      return {
        status: 400,
        message: `There was a problem deleting the treatment`
      }
    }
  });
  if(removedTreatment) {
    console.log("Treatment is succesfully removed");
    return {
      status: 200,
      message: `Treatment has been succesfully removed`
    }
  }
}

module.exports = removeTreatment;