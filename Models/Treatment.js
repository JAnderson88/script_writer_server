const mongoose = require('mongoose');

const Treatment = new.mongoose.Schema({
  project: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  location: {
    type: String,
    required: true
  }
})