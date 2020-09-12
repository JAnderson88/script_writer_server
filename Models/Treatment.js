const mongoose = require('mongoose');

const treatment = new mongoose.Schema({
  project: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

module.exports = Treatment = mongoose.model('treatment', treatment);