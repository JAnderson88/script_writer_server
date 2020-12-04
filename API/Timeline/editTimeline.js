const express = require('express');
const route = express.Router();
const Project = require('../../Models/Project');
const Timeline = require('../../Models/Timeline');
const Scene = require('../../Models/Scene');
const addScene = require('../Scene/addScene');
const editScene = require('../Scene/editScene');
const getScene = require('../Scene/getScene');
const removeScene = require('../Scene/removeScene');
const colorPicker = require('../../Modules/ColorPicker/colorPicker');
const sessionStorage = require('../../Modules/SessionStorage/sessionStorage');

route.put('/', async (req, res) => {
  if (!req.headers['authorization']) return res.status(401).json({ message: "You are not authorized" });
  console.log("Running editTimeline");
  const storage = sessionStorage();
  const userid = storage.getSession(req.headers['authorization']);
  if (req.body.project && userid) {
    const project = await Project.findOne({ "_id": req.body.project });
    if (!project) return res.status(204).json({ message: "There was something wrong with returning the result" });
    const timeline = await Timeline.findOne({ "project": req.body.project });
    if (!timeline) return res.status(204).json({ message: "There was something wrong with returning the result" });
    if (req.body.data && project) {
      let scene;
      let status;
      if (req.body.data.method === 'color') {
        const oldColorArray = [...timeline.colorArray];
        timeline.colorArray[parseInt(req.body.data.options.index) - 1] = req.body.data.options.value;
        const savedTimeline = await Timeline.updateOne({ "_id": timeline._id }, { $set: { colorArray: timeline.colorArray } });
        if (!savedTimeline) {
          timeline.colorArray = [...oldColorArray];
          return res.status(405).json({
            message: 'There was an error updating the color',
            colorArray: timeline.colorArray
          });
        }
        status = true;
      }
      if (req.body.data.method === 'add') {
        if (req.body.data.options.type === "act") {
          timeline.scenes.push([]);
          const tempArray = [...timeline.colorArray];
          tempArray.push(colorPicker(timeline.colorArray));
          timeline.colorArray = [...tempArray];
          const savedTimeline = await timeline.save();
          if (!savedTimeline) return res.status(500).json({ message: "There was something wrong with returning the result" });
          project.scriptOptions = timeline.scenes.length.toString();
          const savedProject = await project.save();
          if (!savedProject) return res.status(500).json({ message: "There was something wrong with returning the result" });
          status = true;
        }
        if (req.body.data.options.type === "scene") {
          scene = await addScene(timeline._id, parseInt(req.body.data.options.act), timeline.scenes[parseInt(req.body.data.options.act) - 1].length);
          if (scene === false || scene === undefined) {
            status = false;
          } else {
            const tempScenes = [...timeline.scenes];
            const length = timeline.scenes[parseInt(req.body.data.options.act) - 1].length;
            tempScenes[parseInt(req.body.data.options.act) - 1][length] = scene;
            timeline.scenes = [...tempScenes];
            status = true;
            const savedTimeline = await timeline.save();
            if (!savedTimeline) return res.status(500).json({ message: "There was something wrong with returning the result" });
            status = true;
          }
        }
      };
      if (req.body.data.method === 'edit') {
        if (req.body.data.options.data) {
          req.body.data.plot.data = req.body.data.options.data;
        }
        sceneUpdateStatus = await editScene(req.body.data.plot);
        status = (sceneUpdateStatus === false) ? false : true;
      };
      if (req.body.data.method === 'remove') {
        if (req.body.data.options.type === "act") {
          const deleteQuery = { _id: { $in: timeline.scenes[req.body.data.options.act - 1] } }
          const scenesDeletionconfirmation = await Scene.deleteMany(deleteQuery);
          if (!scenesDeletionconfirmation) {
            console.log(scenesDeletionconfirmation);
          }
          const frontHalf = [...timeline.scenes.slice(0, req.body.data.options.act -1)];
          const backHalf = [...timeline.scenes.slice(req.body.data.options.act)];
          for (let i = 0; i < backHalf.length; i++) {
            console.log(backHalf[i]);
            if (backHalf[i].length > 0) {
              const newAct = (frontHalf.length + (i + 1)).toString();
              console.log(newAct);
              const updateQuery = { _id: { $in: backHalf[i] } }
              const scenesUpdateConfirmation = await Scene.updateMany(updateQuery, { $set: { act: newAct } });
              if (!scenesUpdateConfirmation) {
                console.log(scenesUpdateConfirmation);
              }
            }
          }
          const tempArray = [...frontHalf, ...backHalf];
          timeline.scenes = [...tempArray];
          project.scriptOptions = timeline.scenes.length.toString();
          const tempColorArray = [...timeline.colorArray.slice(0, req.body.data.options.act-1), ...timeline.colorArray.slice(req.body.data.options.act)];
          timeline.colorArray = [...tempColorArray];
          const savedTimeline = await timeline.save();
          if (!savedTimeline) return res.status(500).json({ message: "There was something wrong with returning the result" });
          const savedProject = await project.save();
          if (!savedProject) return res.status(500).json({ message: "There was something wrong with returning the result" });
          status = true;
        }
        if (req.body.data.options.type === "scene") {
          console.log(req.body.data);
          const act = parseInt(req.body.data.plot.act) - 1;
          console.log(act);
          const sceneId = req.body.data.plot.sceneId;
          console.log(sceneId);
          //Delete Scene
          console.log(timeline.scenes[act][sceneId]);
          const deleteQuery = { _id: timeline.scenes[act][sceneId] };
          const sceneDeletionconfirmation = await Scene.deleteOne(deleteQuery);
          if (!sceneDeletionconfirmation) {
            console.log(sceneDeletionconfirmation);
          }
          //Decrement of each Scene that proceded it because they have a new spot
          const frontHalf = [...timeline.scenes[act].slice(0, sceneId)];
          const backHalf = [...timeline.scenes[act].slice(sceneId + 1)];
          console.log(frontHalf);
          console.log(backHalf);
          const updateQuery = { _id: { $in: backHalf } }
          const incrementor = { $inc: { sceneId: -1 } }
          const updateSceneIdConfrimation = await Scene.updateMany(updateQuery, incrementor);
          console.log(updateSceneIdConfrimation);
          if (!updateSceneIdConfrimation){
            console.log(updateSceneIdConfrimation)
          }
          const tempArray = [...frontHalf, ...backHalf];
          timeline.scenes[parseInt(req.body.data.plot.act)-1] = [...tempArray];
          const savedTimeline = await timeline.save();
          if (!savedTimeline) return res.status(500).json({ message: "There was something wrong with returning the result" });
          status = true;
        }
      };
      if (status) {
        if (req.body.data.method === 'color') {
          return res.status(200).json({
            message: 'Color has been updated succesfully',
            colorArray: timeline.colorArray
          });
        }
        const updatedTimeline = [];
        for (let i = 0; i < timeline.scenes.length; i++) {
          for (let j = 0; j < timeline.scenes[i].length; j++) {
            updatedTimeline.push(await Scene.findOne({ "_id": timeline.scenes[i][j] }));
          }
        }
        return res.status(200).json({
          message: "Timeline has been updated succesfully",
          timeline: updatedTimeline,
          acts: timeline.scenes.length - 1,
          colorArray: timeline.colorArray,
        });
      }
    }
    return res.status(405).json({ message: "There was something wrong with returning the result" });
  } else {
    return res.status(400).json({ message: "There was something wrong with returning the result" });
  }
});

module.exports = route;