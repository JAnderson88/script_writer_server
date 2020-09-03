const mongoose = require('mongoose');
require('mongoose-type-email');

const user = new mongoose.Schema({
  email: {
    type: mongoose.SchemaTypes.Email,
    trim: true, unique: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  fileDirectory: {
    type: String,
    required: true
  },
  projects: {
    type: Array,
    default: [],
    required: true
  }
})

module.exports = User = mongoose.model('user', user)