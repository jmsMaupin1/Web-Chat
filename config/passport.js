const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

module.exports = (passport) => {
	// Required passport methods
	passport.serializeUser( (user, done) => {
		done(null, user.id);
	})

	passport.deserializeUser( (id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		})
	})

	// Local Sign up
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, email, password, done) => {
		process.nextTick( () => {
			User.findOne({ 'local.email': email }, (err, user) => {
				if (err) return done(err);

				// User already exists
				if (user) {
					console.log('user already exists');
					return done(null, false);
				}

				console.log(req.body);

				// Otherwise create and store a new user - complete registration
				const newUser = new User();

				// Set local credentials
				newUser.local.username = req.body.username;
				newUser.local.email = email;
				newUser.local.password = newUser.generateHash(password);

				// Save User to mongodb via mongoose
				newUser.save( (err) => {
					if (err) throw err;
					return done(null, newUser);
				})
			})
		})
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, email, password, done) => {
		User.findOne( {'local.email' : email }, (err, user) => {
			if (err) throw err;

			// User is not found
			if (!user) return done(null, false);

			// Password is invalid
			if (!user.validPassword(password))
				return done(null, false);

			// Login Authentication successfull
			return done(null, user);
		})
	}))
}