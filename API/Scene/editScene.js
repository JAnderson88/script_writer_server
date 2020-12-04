const Scene = require('../../Models/Scene');

module.exports = async (plotObj) => {
  const plot = await Scene.findOne({ "_id": plotObj._id });
  if (!plot) return "There was something wrong with returning the result";
  plot.editedOn = Date.now();
  //act
  if (plot.act !== plotObj.act) plot.act = plotObj.act;
  //charachters
  if (plot.charachters.length !== plotObj.charachters.length) plot.charachters = [...plotObj.charachters];
  //scene
  if (plot.scene !== plotObj.scene) plot.scene = plotObj.scene;
  //data
  if (plot.data !== plotObj.data) plot.data = plotObj.data;
  const savedPlot = await plot.save();
  if (!savedPlot) return false;
  return true;
}