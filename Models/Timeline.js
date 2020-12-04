const mongoose = require('mongoose');

const timeline = new mongoose.Schema({
  project: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now,
    required: true
  },
  editedOn:{
    type: Date,
    default: Date.now
  },
  scenes:[[{
    type: mongoose.SchemaTypes.ObjectId
  }]],
  colorArray: [{
    type: String
  }]
});

module.exports = Timeline = mongoose.model('timeline', timeline);