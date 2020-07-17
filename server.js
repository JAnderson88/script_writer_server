const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
const DBConnection = require('./Models/Connection');

DBConnection('screenwriter');

app.use(express.json({ extended: false }));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use(session({secret: "secrettt", resave:false, saveUninitialized:true}));
const Port = process.env.port || 3000;

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

app.listen(Port, () => console.log(`Server started, connected to ${Port}`));
