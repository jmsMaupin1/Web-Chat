module.exports = (app, passport) => {

	app.get('/', (req, res) => {
		if(req.isAuthenticated())
			return res.redirect('/auth')
		else
			return res.redirect('/login')
	})

	app.get('/user_info', (req, res) => {
		if(req.isAuthenticated())
			res.json(req.user.local.username);
		else
			res.json({error: 'User is not logged in'});
	});

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