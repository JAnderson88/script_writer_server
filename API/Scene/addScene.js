const Scene = require('../../Models/Scene');

module.exports = async (timelineId, act, sceneId) => {
  const newEntry = {};
  newEntry.timeline = timelineId;
  newEntry.act = act;
  newEntry.sceneId = sceneId;
  newEntry.data = "";
  newEntry.charachters = [];
  const sceneModel = new Scene(newEntry);
  const sceneConfirmation = await sceneModel.save();
  if (!sceneConfirmation) return false;
  return sceneModel.id;
}