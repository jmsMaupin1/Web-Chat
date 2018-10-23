// Import express and dependencies
// Import express and middleware dependencies 
const express      = require('express');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

// Import the rest of the tools
const mongoose     = require('mongoose');
const passport     = require('passport');
const path         = require('path');

// Get Configurations
const configDB     = require('./config/database');

// Set up express 
const app          = express();
const port         = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

// Required for passport
app.use(session({ secret: 'not-really-the-secret'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Configuration
mongoose.connect(configDB.url);
require('./config/passport')(passport);

// // Routes
require('./app/routes.js')(app, passport, express);

app.use('/', express.static(path.join(__dirname + '/views/login-registration/')));
app.use('/auth', express.static(path.join(__dirname + '/views/authenticated-page/')));

// Launch
app.listen(port, (err, res) => {
	if(err) throw err;

	console.log(`Listening on port: ${port}`)
});