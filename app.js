const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const circles = require('./routes/circles');
const sockets = require('./socketModule')
app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//add user management
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const config = require('./config/redis')
const passport = require('passport')

require('./auth').init(app)
console.log(config.redisStore.secret)
app.use(session({
    store: new MongoStore({
        db: 'express',
        url: 'mongodb://localhost/murder'
    }),
    secret: "very secret secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure : false
    }
}))

app.use(passport.initialize())
app.use(passport.session())



sockets.createServer(app)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/js', express.static('bower_components'))
app.use('/src', express.static('src'))
app.use('/public', express.static('public'))


app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/test', passport.authenticationMiddleware(), function(req, res){
    res.send('have an index page')
})

app.get('/login', function(req, res, next){
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/successLogin',
    failureRedirect: '/failedLogin'
}))

app.get('/successLogin', function(req, res, next){
    res.send('you have been logged in')
})

//app.use('/', index);
app.use('/users', users);
app.use('/circles', circles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000)

module.exports = app;
