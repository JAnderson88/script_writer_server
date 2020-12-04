const express = require('express');
const route = express.Router();
const Project = require('../../Models/Project');
const Timeline = require('../../Models/Timeline');
const Scene = require('../../Models/Scene');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

//needed: session, projectId
route.get('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running getTimeline")
  const storage = sessionStorage();
  const userid = storage.getSession(req.headers['authorization']);
  if (!userid) return res.status(204).json({ message: "There was something wrong with returning the result" });
  if (req.query.project && userid) {
    const queryProjectString = req.query.project;
    const timeline = await Timeline.findOne({ "project": queryProjectString });
    if (!timeline) return res.status(400).json({ message: "There was something wrong returning the result" });
    const scenes = [];
    for (let i = 0; i < timeline.scenes.length; i++) {
      for (let j = 0; j < timeline.scenes[i].length; j++) {
        scenes.push(await Scene.findOne({ "_id": timeline.scenes[i][j] }));
      }
    }
    res.status(200).json({
      message: "Timeline returned succesfully",
      timeline: scenes,
      acts: timeline.scenes.length - 1,
      colorArray: timeline.colorArray
    });
  }
});

module.exports = route;