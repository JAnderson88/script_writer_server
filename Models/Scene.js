const mongoose = require('mongoose');

const scene = new mongoose.Schema({
  createdOn: {
    type: Date,
    default: Date.now,
    required: true
  },
  editedOn: {
    type: Date,
    default: Date.now,
  },
  timeline: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  sceneId: {
    type: Number,
    required: true,
  },
  act: {
    type: String,
  },
  data: {
    type: String,
  },
  charachters: [{
    type: "String"
  }]
});

module.exports = Scene = mongoose.model('scene', scene);