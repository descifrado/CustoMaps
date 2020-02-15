const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const {User,validate} = require('../models/users')

// populate cookies
passport.serializeUser((user,done)=>{           
    done(null,user.id)

})

// retrieve cookies
passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        console.log("csdc"+user)//Problem
        done(null,user)
    })
})

passport.use('google',
    new GoogleStrategy({
        //option for the google strategy
        callbackURL:'/auth/google/redirect', // google will redirect my web to this site
        clientID:keys.google.clientID,
        clientSecret:keys.google.clientSecret
    },
    async (accessToken, refreshToken, profile, done)=> {
        User.findOne({googleid:profile.id}).then((currentUser)=>{
            if(currentUser){
                //user exists
                done(null,currentUser)   // serialising currentUser  setting up cookies
            }else{
                //create a new one
                new User({
                    name:profile.displayName,
                    password:profile.id,
                    email:profile.id,
                    googleid:profile.id
                }).save()
                .then((newUser)=>{
                    console.log("new user added" )
                    done(null,newUser)
                }).catch((err)=>{
                    done(err,null)
                })

            }
        })

        //this is google params which takes session etc | passport call back func
            //     User.findOrCreate({ googleId: profile.id }, function (err, user) {
            // return done(err, user);
            console.log(profile);
           // res.send(profile.displayName)
        
    })     
    
);






       // console.log('firing callback function');
    



      