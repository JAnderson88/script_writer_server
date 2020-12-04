const Timeline = require('../../Models/Timeline');

const addTimeline = async (project, authorization) => {
  if (!authorization) return;
  const timeline = {};
  timeline.project = project.id;
  timeline.scenes = [];
  timeline.colorArray = [];
  for(let i=0; i<parseInt(project.scriptOptions); i++){
    timeline.scenes.push([]);
    timeline.colorArray.push(i);
  }
  const timelineModel = new Timeline(timeline);
  const timelineConfirmation = await timelineModel.save();
  if (!timelineConfirmation) return false;
  return timelineModel.id;
}

module.exports = addTimeline;