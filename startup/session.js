const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');


module.exports = session({
    secret: 'cats',
    resave : true,
    saveUninitialized : true, 
    cookie : { 
        secure: false
    }, // configure when sessions expires
    maxAge : Date.now() + 10*1000,
    store: new MongoStore({ mongooseConnection: mongoose.connection,
                            ttl : 31*24*60*60})
})