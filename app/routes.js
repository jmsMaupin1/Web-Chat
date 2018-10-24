const path = require('path');

module.exports = (app, passport, express) => {
	
	app.get('/', (req, res, next) => {
		if(req.isAuthenticated())
			return res.redirect('/auth')
		else
			return res.redirect('/login')
	})
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/auth',
		failureRedirect: '/login#toregister'
	}))

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/auth',
		failureRedirect: '/login'
	}))
}

// Authentication Middleware
function isLoggedIn (req, res, next) {
	if(req.isAuthenticated())
		return next();

	return res.redirect('/')
}