// Import express and middleware dependencies
const express      = require('express');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

// Import the rest of the tools
const mongoose     = require('mongoose');
const passport     = require('passport');
const socket       = require('socket.io');

// DB Config
const dbPath       = require('./config/database').url;

// Set up server app
const app          = express();
const port         = process.env.PORT || 8080;

// Set up middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
	secret: process.env.APP_SECRET || 'this is the dev secret',
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// Connect to mongo
mongoose.connect(dbPath, { useNewUrlParser: true });
require('./config/passport')(passport);

require('./app/routes')(app, passport);

let server = app.listen(port, () => {
    console.log(`Listening on ${port}`);
})

require('./app/event-handler')(server);
