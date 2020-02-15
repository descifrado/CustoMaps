const mongoose = require('mongoose'),
    Joi = require('joi'),  //for validating
    jwt = require('jsonwebtoken'),
    config = require('config'),
    bcrypt = require('bcrypt-nodejs')

var ObjectId = mongoose.Schema.Types.ObjectId;
const reportSchema = new mongoose.Schema({
    reporter:{
        type:ObjectId,
        required : true
    },
    incident : {
        type : String,
        minlength : 0,
        maxlength : 500
    },
    lat : {
        type : Number,
        required : true
    },
    lgt : {
        type : Number,
        required : true
    }
});



const Report = mongoose.model('Report',reportSchema);  // 1st arg is the singular object in database 2nd is Schema


exports.dbReport = Report;
