const IDGenerator = require('../../Modules/idGenerator/idgenerator');

module.exports = (treatment) => {
  // console.log(treatment);
  console.log("Running addParagraph");
  const newTreatment = JSON.parse(JSON.stringify(treatment));
  console.log(newTreatment);
  const newEntry = {};
  const updateTime = Date.now();
  newEntry.paragraphID = IDGenerator(12);
  newEntry.createdOn = updateTime;
  newEntry.editedOn = updateTime;
  newEntry.tags = "";
  newEntry.body = "";
  newEntry.suggestions = [];
  console.log(newTreatment['paragraphs']);
  newTreatment.paragraphs.push(newEntry);
  return newTreatment;
}