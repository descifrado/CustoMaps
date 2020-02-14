const mongoose = require('mongoose');
const logger = require('../middlewares/logger');
const session = require('express-session');


module.exports = function (app){
    mongoose.connect('mongodb://localhost/youtube',{ useNewUrlParser: true })
    
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

}