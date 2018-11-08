const Room = require('./models/room');

module.exports = (app, passport) => {

    app.get('/', (req, res) => {
        if (req.isAuthenticated())
            return res.redirect('/auth')
        else
            return res.redirect('/login')
    })

    app.get('/user_info', (req, res) => {
        if (req.isAuthenticated()) {
            res.json({
                _id     : req.user._id,
                username: req.user.username,
            });
        }
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

    app.post('/newroom', isLoggedIn, (req, res) => {
        Room.createRoom(req.body.roomname, (err, room) => {
            Room.join(room._id, req.user._id, (err, newRoom) => {
                if (err) throw err;

                return res.redirect('/');
            })
        })
    })
}

// Authentication Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    return res.redirect('/')
}