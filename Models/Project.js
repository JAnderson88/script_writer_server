const mongoose = require('mongoose');

const project = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now,
    required: true
  },
  editedOn: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  createdBy: {
    type: String
  },
  scriptType: {
    type: String,
    enum: ["Movie", "Episodic"],
    default: "Movie"
  },
  scriptOptions: {
    type: String,
    default: "1"
  },
  treatment: {
    type: mongoose.SchemaTypes.ObjectId
  },
  timeline: {
    type: mongoose.SchemaTypes.ObjectId
  },
  charachters: [{
    type: mongoose.SchemaTypes.ObjectId
  }]
});

module.exports = Project = mongoose.model('project', project);