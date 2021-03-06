const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('monk')('localhost/murder')
const users = db.get('users')

const authenticationMiddleware = require('./auth-middleware')


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    users.findOne({_id: id}, function(err, user) {
        done(err, user);
    });
});

function initPassport () {
    passport.use('local', new LocalStrategy({
            usernameField: 'user',
            passwordField: 'passwd'
        },
        function(username, password, done) {
            console.log('start lookup')
            users.findOne({ name: username }, function(err, user) {
                if (err) { return done(err); }

                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.passwd== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));
    passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport