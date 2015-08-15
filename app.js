var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    jwt = require('express-jwt'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

require('./models/Task');
require('./models/Location');
require('./models/Specialty');
require('./models/User');

var secret = require('./secret'),
authenticate = require('./routes/authenticate'),
api = require('./routes/api');

mongoose.connect('mongodb://localhost/taskmanager');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// statics
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower',express.static(path.join(__dirname, 'bower_components')));
app.use('/angular',express.static(path.join(__dirname, 'angular')));

app.use(jwt({ secret: secret}).unless({path: ['/','/authenticate']}));

app.use(bodyParser.json());
if (app.get('env') === 'development') {
    app.use(bodyParser.urlencoded({ extended: false }));
}

app.get('/', function(req, res, next) {
    res.render('index', { title: 'TaskManager', version: "0.0.2" });
});
app.post('/authenticate', authenticate);

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
