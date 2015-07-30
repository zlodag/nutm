var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Task = require('../models/Task.js');

/* GET /tasks */
router.get('/', function(req, res, next) {
  Task.find({completed:false},function (err, tasks) {
    if (err) return next(err);
    res.json(tasks);
  });
});

/* POST /tasks/reflect */
router.post('/reflect/', function(req, res, next) {
  res.json(req.body);
});

/* POST /tasks */
router.post('/', function(req, res, next) {
  Task.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
