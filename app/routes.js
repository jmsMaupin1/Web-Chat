const path = require('path');

module.exports = (app, passport, express) => {
	app.use('/', express.static(path.join(__dirname + '/views/login-registration/')));
	app.use('/auth', isLoggedIn, express.static(path.join(__dirname + '/views/authenticated-page/')));

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/auth',
		failureRedirect: '/#toregister'
	}))

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/auth',
		failureRedirect: '/'
	}))
}

// Authentication Middleware
function isLoggedIn (req, res, next) {
	if(req.isAuthenticated())
		return next();

	return res.redirect('/')
}