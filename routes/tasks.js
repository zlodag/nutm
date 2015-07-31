var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Task = require('../models/Task.js');

/* GET /tasks */
router.get('/', function(req, res, next) {
  Task.find(function (err, tasks) {
    if (err) return next(err);
    res.json(tasks);
  });
});

/* GET /tasks/id */
router.get('/:id', function(req, res, next) {
  Task.findById(req.params.id,function (err, task) {
    if (err) return next(err);
    res.json(task);
  });
});

/* PUT /tasks/id */
router.put('/:id', function(req, res, next) {
  Task.findByIdAndUpdate(req.params.id,req.body,{new:true},function (err, newTask) {
    if (err) return next(err);
    res.json(newTask);
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

/* POST /tasks/:id */
router.post('/:id', function(req, res, next) {
  Task.findById(req.params.id,function (err, task) {
    if (err) return next(err);
    task.comments.push(req.body);
    task.save(function(err){
        if (err) return next(err);
        res.json(task);
    });
  });
});

module.exports = router;
