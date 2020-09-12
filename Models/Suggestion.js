const mongoose = require('mongoose');

const suggestion = new mongoose.Schema({
  project: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  paragraph: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  editedOn: {
    type: Date,
    default: Date.now()
  },
  classification: {
    type: String
  },
  data: {
    type: String
  }
});

module.exports = Suggestion = mongoose.model('suggestion', suggestion);