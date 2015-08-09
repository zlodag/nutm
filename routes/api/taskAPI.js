var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Task = mongoose.model('Task'),
// Specialty = mongoose.model('Specialty'),
// Building = mongoose.model('Building'),
cb = require('../callback');

router.get('/', function(req, res, next) {
    Task.find()
    .lean()
    .populate('comments.user added.user accepted.user completed.user cancelled.user', 'name username') //user fields
    .populate('patient.specialty', 'name')
    .populate('patient.ward','name building')
    .sort('added.time')
    //.populate('patient.ward.building','name')
    .exec(function(err, tasks){
        if(err){ return next(err); }
        res.json(tasks);
    });
});
router.post('/', function(req, res, next) {
    //if (!req.body.name) { return next(cb("No name supplied for task",422)); }
    var newTask = {
        // updates: [ {
        //     type: 'add',
        //     // user: '55c695663fcc64917de8422c' //wrong
        //     user: '55c6539acaa15530234f6d48' //right
        // } ],
        patient: {
            nhi: 'asd2341',
            ward: '55c695663fcc64917de8422c', //right
            // ward: '55c6539acaa15530234f6d48', //wrong
            bed: '16A',
            specialty: '55c64c862fd79dc915a412e7' //right
            // specialty: '55c6539acaa15530234f6d48' //wrong
        },
        text: 'Please come and tie my shoes',
        urgency: 3,
        // added: {
        //     comment: 'How about it?',
        //     user: '55c6539acaa15530234f6d48' //right
        //     // user: '55c695663fcc64917de8422c' //wrong
        // }
    };
    mongoose.model('Ward').findById(newTask.patient.ward, function(err, ward){
        if (err) { return next(err); }
        console.log('The supplied ward ID was: %s',newTask.patient.ward);
        console.log('The found ward was: %s',ward);
        if (!ward) { return next(cb("Ward not found",404));}
        mongoose.model('Specialty').findById(newTask.patient.specialty, function(err, specialty){
            if (err) { return next(err); }
            console.log('The supplied specialty ID was: %s',newTask.patient.specialty);
            console.log('The found specialty was: %s',specialty);
            if (!specialty) { return next(cb("Specialty not found",404));}
            var task = new Task(newTask);
            task.updateStatus('added','55c6539acaa15530234f6d48','What a great comment!',function(err, newTask){
                if(err){
                    //console.log(err);
                    return next(err);
                }
                // console.log(newTask.populate);
                newTask
                // .lean()
                // .populate('comments.user added.user accepted.user completed.user cancelled.user', 'name username') //user fields
                // .populate('patient.specialty', 'name')
                .populate({path:'comments.user added.user accepted.user completed.user cancelled.user',select:'name username'})
                .populate({path:'patient.specialty',select:'name'})
                .populate({path:'patient.ward',select:'name building'})
                .execPopulate()
                // .lean()
                .then(function(task){
                    if(err){ return next(err); }
                    res.status(201).json(task);
                });
            });
        });
    });
});
router.param('taskId', function(req, res, next, taskId) {
    Task.findById(taskId, function (err, task){
        if (err) { return next(err); }
        else if (!task) { return next(cb("Task not found",404)); }
        console.log('Task ID:' + task._id);
        req.task = task;
        next();
    });
});
router.get('/:taskId', function(req, res, next) {
    res.json(req.task);
});
// router.put('/:taskId', function(req, res, next) {
//     if (!req.body.text && !req.body.urgency) { return next(cb("No updated text or urgency supplied for task",422)); }
//     if(req.body.text) {req.task.text = req.body.text;}
//     if(req.body.urgency) {req.task.urgency = req.body.urgency;}
//     req.task.save(function(err, task){
//         if(err){ return next(err); }
//         res.status(204).end();
//     });
// });

router.put('/:taskId', function(req, res, next) {
    var user = '55c65b8d89ec4dc92e0619e1';
    req.task.updateStatus(req.body.status, user, req.body.comment, function(err, task){
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
    req.task.comments.push({
        comment: "  Random malformed stuff. . .    ",
        user: '55c653d2caa15530234f6d49'
    });
    req.task.save(function(err, task){
        if(err){ return next(err); }
        res.status(201).json(task);
    });
});

module.exports = router;