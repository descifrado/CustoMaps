const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new LocalStrategy(
    
  function(username, password, done) {
      
    const test = User.findOne({ name: username }, function (err, user) {
      if (err) { return done(err); 
        
    }
      if (!user) {
        console.log(User.findOne( {name: username}).name)
        return done(null, false, { message: 'Incorrect username.' });
      }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
      return done(null, user);
    });
  }
));

