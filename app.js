var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

require('./models/Task.js');
require('./models/Location.js');

var routes = require('./routes/index');
var taskAPI = require('./routes/taskAPI.js');
var buildingAPI = require('./routes/buildingAPI.js');
var wardAPI = require('./routes/wardAPI.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/taskmanager');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower',express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/api/tasks', taskAPI);
app.use('/api/building', buildingAPI);
app.use('/api/ward', wardAPI);

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
