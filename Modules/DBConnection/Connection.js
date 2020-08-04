const mongoose = require('mongoose');
const DBConnections = require('./DBConnections');

const connectDB = async (model) => {
    const connections = DBConnections();
    const URI = connections[model];
    mongoose.connect(URI,{ useNewUrlParser: true, useUnifiedTopology: true});
    console.log(`${model} collection connected`)
}

module.exports = connectDB;