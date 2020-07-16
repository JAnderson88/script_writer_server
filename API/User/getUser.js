const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const User = require('../../Models/User');

route.get('/', async (req, res) => {
    console.log(req.body);
    
})

module.exports = route;


