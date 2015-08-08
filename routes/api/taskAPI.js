var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Task = mongoose.model('Task'),
// Specialty = mongoose.model('Specialty'),
// Building = mongoose.model('Building'),
cb = require('../callback');

router.get('/', function(req, res, next) {
    Task.find()
    .populate('updates.user', 'name username')
    .lean()
    .sort('urgency')
    .exec(function(err, tasks){
        if(err){ return next(err); }
        res.json(tasks);
    });
});
router.post('/', function(req, res, next) {
    //if (!req.body.name) { return next(cb("No name supplied for task",422)); }
    Task.create({
        updates: [ {
            type: 'add',
            user: '55c653d2caa15530234f6d49'
        } ],
        text: 'Please come and tie my shoes',
        urgency: 3,
        patient: {
            nhi: 'asd2341',
            //ward: '55c64c462fd79dc915a412e5',
            bed: '16A',
            //specialty: '55c64c862fd79dc915a412e7'
        }
    },function(err, task){
        if(err){
            console.log(err);
            return next(err);
        }
        res.status(201).json(task);
    });
});
router.param('taskId', function(req, res, next, taskId) {
    Task.findById(taskId, function (err, task){
        if (err) { return next(err); }
        else if (task === null) { return next(cb("Task not found",404));}
        console.log(task.fullname);
        req.task = task;
        next();
    });
});
router.get('/:taskId', function(req, res, next) {
    res.json(req.task);
});
router.put('/:taskId', function(req, res, next) {
    if (!req.body.text && !req.body.urgency) { return next(cb("No updated text or urgency supplied for task",422)); }
    if(req.body.text) {req.task.text = req.body.text;}
    if(req.body.urgency) {req.task.urgency = req.body.urgency;}
    req.task.save(function(err, task){
        if(err){ return next(err); }
        res.status(204).end();
    });
});
router.delete('/:taskId', function(req, res, next) {
    req.task.remove(function(err, task){
        if(err){ return next(err); }
        res.status(204).end();
    });
});
router.post('/:taskId', function(req, res, next) {
    req.task.updates.push({
        type: "comment",
        comment: "  Random malformed stuff. . .    ",
        user: '55c653d2caa15530234f6d49'
    });
    req.task.save(function(err, task){
        if(err){ return next(err); }
        res.status(201).json(task);
    });
});

module.exports = router;