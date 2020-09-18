module.exports = (treatment, requestBody) => {
  const newTreatment = JSON.parse(JSON.stringify(treatment));
  const { tags, body, id } = requestBody;
  const editedTime = Date.now();
  for (let i = 0; i < newTreatment.paragraphs.length; i++) {
    if (newTreatment.paragraphs[i].paragraphID === id) {
      newTreatment.editedOn = editedTime;
      newTreatment.paragraphs[i].editedOn = editedTime;
      newTreatment.paragraphs[i].tags = tags;
      newTreatment.paragraphs[i].body = body;
      break;
    }
  }
  return newTreatment;
}