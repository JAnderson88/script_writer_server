const mongoose = require('mongoose');

const project = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
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