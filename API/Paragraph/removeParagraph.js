module.exports = (treatment, requestBody) => {
  console.log(treatment);
  console.log("Running addParagraph");
  const newTreatment = JSON.parse(JSON.stringify(treatment));
  newTreatment.paragraphs = [];
  const { id } = requestBody;
  for (let i = 0; i < treatment.paragraphs.length; i++) {
    if (treatment.paragraphs[i].paragraphID !== id) {
      newTreatment.paragraphs.push(treatment.paragraphs[i]);
    }
  }
  return newTreatment;
}