const LocalStrategy = require('passport-local').Strategy;
const {dbUser} = require('../dbModels/user');
const passport = require('passport');

passport.serializeUser(function(user,done) {		
	console.log('Serializer called '  + user);	
	var sessionUser = {email : user.email,name : user.name,isAdmin : user.isAdmin,_id : user._id};
	done(null,sessionUser);			// this would save sessionUser to req.session.passport.user
});

passport.deserializeUser(function(sessionUser,done) {	// here sessionUser points req.session.passport.user
	console.log('desrialzer called '+ sessionUser.email);
	done(null,sessionUser);								// the result here is that req.user points to sessionUser i.e. to get email -> req.user.email
});

console.log("in passport");

passport.use(new LocalStrategy({
	usernameField: 'email',
    passwordField: 'password'
},
	// here done is verify callback
function(email, password, done) {
	console.log(email);
	dbUser.findOne({ email: email }, function (err, dbuser) {
		console.log(email);
		if (err) { console.log(err) }

		if (!dbuser) {
			return done(null, false, { message: 'Incorrect username.' });
		}
		var isSame = dbuser.comparePassword(password,dbuser.password);

		if (isSame) {
			//console.log(dbuser);
			return done(null,dbuser);
		}else{
			return done(null, false);
		}
	});
}
))



