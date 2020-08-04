const express = require('express');
const cors = require('cors');
const app = express();
let env = require('dotenv').config().parsed;
const DBConnection = require('./Modules/DBConnection/Connection');

DBConnection('screenwriter');

app.use(express.json({ extended: false }));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const Port = env.port || 3000;

//Users
//add
app.use('/api/user/add', require('./API/User/addUser'));
//edit
app.use('/api/user/edit', require('./API/User/editUser'));
//read
app.use('/api/user', require('./API/User/getUser'));
//delete
app.use('/api/user/delete', require('./API/User/removeUser'));

//Auth
//login
app.use('/api/user/login', require('./API/Auth/login'));
//logout
app.use('/api/user/logout', require('./API/Auth/logout'));

//Projects
//add
app.use('/api/project/add', require('./API/Projects/addProject'));
//edit
app.use('/api/project/edit', require('./API/Projects/editProject'));
//read
app.use('/api/project', require('./API/Projects/getProjects'));
//delete
app.use('/api/project/delete', require('./API/Projects/removeProject'));

app.listen(Port, () => console.log(`Server started, connected to ${Port}`));
