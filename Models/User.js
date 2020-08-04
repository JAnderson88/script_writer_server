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
        type:String
    },
    projects: {
        type: Array,
        default: []
    },
    treatment: {
        type: Array,
        default: []
    }
})

module.exports = User = mongoose.model('user', user)