/**
 * Created by Martin on 05.03.2017.
 */
var LocalStrategy   = require('passport-local').Strategy;
var passport = require('passport')

const db = require('monk')('localhost/murder')
const users = db.get('users')

passport.use(new LocalStrategy({
        usernameField: 'user',
        passwordField: 'passwd'
    },
    function(username, password, done) {
        console.log('lookup')
        users.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

