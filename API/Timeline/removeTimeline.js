const Timeline = require('../../Models/Timeline');

const removeTimeline = async (timelineId, authoriazation) => {
  if (!authoriazation) return;
  console.log("Passed authorization");
  const removedTimeline = await Timeline.remove({ "_id": timelineId}, err => {
    if (err) {
      console.log(err);
      console.log("Error removing timeline");
      return {
        status: 400,
        message: `There was a problem deleting the timeline`
      }
    }
  });
  if(removedTimeline) {
    console.log("Timeline is succesfully removed");
    return {
      status: 200,
      message: `Timeline has been succesfully removed`
    }
  }
}

module.exports = removeTimeline;