const passport = require('../config/passport');

sendUser = (req,  res) => {
    if(req.user) {
        const user = JSON.parse(JSON.stringify(req.user));
        delete user.password;
        res.json(user);
    } else {
        res.json({user: null});
    }
}

module.exports = (app, passport) => {
    app.get('/user', (req, res) => {
        sendUser(req, res);
    })

    app.post('/login', passport.authenticate('local-login'), (req, res) => {
        sendUser(req, res);
    })

    app.post('/register', passport.authenticate('local-signup'), (req, res) => {
        sendUser(req, res);
    })
}