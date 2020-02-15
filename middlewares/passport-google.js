var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var { dbUser } = require('../dbModels/user');
const keys = require('../config/keys');
const crypto = require('crypto');


passport.serializeUser(function (user, done) {
	console.log('Serializer called ' + user);
	var sessionUser = { email: user.email, name: user.name, isAdmin: user.isAdmin, _id: user._id };
	done(null, sessionUser);			// this would save sessionUser to req.session.passport.user
});

passport.deserializeUser(function (sessionUser, done) {	// here sessionUser points req.session.passport.user
	console.log('desrialzer called ' + sessionUser.email);
	done(null, sessionUser);								// the result here is that req.user points to sessionUser i.e. to get email -> req.user.email
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
	clientID: keys.google.clientID,             //GOOGLE_CLIENT_ID,
	clientSecret: keys.google.clientSecret,      //GOOGLE_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/user/login/google/callback"
},
	async function (accessToken, refreshToken, profile, done) {
		console.log(profile._json.email);
		console.log(accessToken);
		console.log(refreshToken);
		let dbuser = await dbUser.findOne({ email: profile._json.email })
		if (dbuser) {
			console.log(dbuser);
			// passport.serializeUser(function (user, done) {
			// 	console.log('Serializer called ' + user);
			// 	var sessionUser = { email: user.email, name: user.name, isAdmin: user.isAdmin, _id: user._id };
			// 	return done(null, sessionUser);			// this would save sessionUser to req.session.passport.user
			// });
			return done(null, dbuser);
		} else {
			dbuser = new dbUser({
				name: profile._json.name,
				username: 'googleUser',
				password: 'googleUser',
				email: profile._json.email,
			})
			
			console.log(dbuser);
			let err = await dbuser.save()
			return done(err, dbuser);
		}
	}
));