var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
User = mongoose.model('User'),
cb = require('../callback');

router.get('/', function(req, res, next) {
    User.find().lean().sort('name.last').exec(function(err, users){
        if(err){ return next(err); }
        res.json(users);
    });
});
router.post('/', function(req, res, next) {
    if (!req.body.username) { return next(cb("No username supplied for user",422)); }
    User.create({
        name:{
            first: "Michelle", last: "Hudson"
        },
        username: req.body.username,
        password: "I like apples",
        site: "Waikato"
    },function(err, user){
        if(err){ return next(err); }
        res.status(201).json(user);
    });
});
router.param('userId', function(req, res, next, userId) {
    User.findById(userId, function (err, user){
        if (err) { return next(err); }
        else if (user === null) { return next(cb("User not found",404));}
        req.person = user;
        next();
    });
});
router.get('/:userId', function(req, res, next) {
    res.json(req.person);
});
router.put('/:userId', function(req, res, next) {
    //req.person.update()
    // if (!req.body.username && !req.body.password) { return next(cb("No updated username or password supplied for user",422)); }
    if(req.body.username) {req.person.username = req.body.username;}
    if(req.body.password) {req.person.password = req.body.password;}
    if(typeof req.body.admin === 'boolean') {req.person.admin = req.body.admin;}
    req.person.save(function(err, user){
        if(err){ return next(err); }
        res.status(204).end();
    });
});
router.delete('/:userId', function(req, res, next) {
    req.person.remove(function(err, user){
        if(err){ return next(err); }
        res.status(204).end();
    });
});
router.post('/:userId',function(req, res, next) {
    if (!req.body.password) { return next(cb("No password supplied for authentication",422)); }
    res.json({
        password: req.body.password,
        valid: req.person.authenticate(req.body.password)
    });
});

module.exports = router;