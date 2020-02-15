const path = require('path');
const User = require(path.join(__dirname, '../models/user.js'));
const passport = require('passport');
//User = require("../models/user.js");

var signup = async function(req, res, next){
    console.log("recieved signup");
    var params = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            token : req.body.token
        };
    // console.log("reach");
    var newUser = new User(params);
    
    try {
        let result  = await newUser.signup(params)
        res.send(result)
    }catch(ex){
       console.log(ex);
    }
    next();
};

var login = function(req,res,next){
    // be careful this fucking passport.authenticate returns a function which needs to be called
    passport.authenticate('local',function(err,user,info){
        if(user){
            console.log('done here');
            res.send('success')
           
        }else{
             res.send('fail');
        }
    })(req,res,next);
}



var loginGoogle = passport.authenticate('google',{ scope:['profile','email'] })

var loginGoogleCallback = function(req,res,next){
    passport.authenticate('google',function(err,user,info){
        console.log('very nice ' + err);
        console.log('very nice ' + user);
        req.login(user, (err) => {
            console.log('fuck hell');
            res.redirect('/index')
        })
    })(req,res,next);
}

var logout = function(req, res){
    req.logout();
    res.redirect('/');
};


module.exports = {signup: signup,login: login,logout: logout,loginGoogle : loginGoogle,loginGoogleCallback : loginGoogleCallback};