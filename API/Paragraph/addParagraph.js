const IDGenerator = require('../../Modules/idGenerator/idgenerator');

module.exports = (treatment, page) => {
  console.log("Running addParagraph");
  const newTreatment = JSON.parse(JSON.stringify(treatment));
  const newEntry = {};
  const updateTime = Date.now();
  newEntry.paragraphID = IDGenerator(12);
  newEntry.createdOn = updateTime;
  newEntry.editedOn = updateTime;
  newEntry.tags = "";
  newEntry.body = "";
  newEntry.page = page.toString();
  newEntry.suggestions = [];
  newTreatment.paragraphs.push(newEntry);
  return newTreatment;
}