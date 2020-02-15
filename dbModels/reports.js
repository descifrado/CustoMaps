/*jslint es6:true*/
const mongoose = require('mongoose'),
    Joi = require('joi'),  //for validating
    jwt = require('jsonwebtoken'),
    config = require('config'),
    bcrypt = require('bcrypt-nodejs')
  
const reportsSchema = new mongoose.Schema({
    reporter:{
        type:String,
    },
    videoId:{
        type: String,
    } 
});



const Reports = mongoose.model('Reports',reportsSchema);  // 1st arg is the singular object in database 2nd is Schema


exports.dbReports = Reports;
