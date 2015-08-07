var express = require('express');
var router = express.Router();

var User = require('../models/User');
var checkadmin = require('./checkadmin');

//see current user
router.get('/me', function(req, res, next) {
    User.findById(req.decoded.sub,function(err, user){
        if (err) return next(err);
        res.json(user);
    });
});
//update username/password
router.put('/me', function(req, res, next) {
    if (!req.body.name && !req.body.password) {
        return res.json({success:false, message: 'you did not provide a valid field to update'});
    }
    var updateParams = {};
    if (req.body.name) {
        updateParams.name = req.body.name;
    }
    if (req.body.password) {
        updateParams.password = req.body.password;
    }
    User.findByIdAndUpdate(req.decoded.sub,updateParams,{new:true},function(err, newMe){
        if (err) return next(err);
        res.json({success:true, message: 'Updated field(s)'});
    });
});

router.use(checkadmin);

//see all users
router.get('/', function(req, res, next) {
    User.find(function(err, users){
        res.json({users: users});
    });
});

//create user
router.post('/', function(req, res, next) {
    User.create(req.body, function(err, newUser){
        if (err) return next(err);
        res.json(newUser);
    });
});

//retrieve user
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id,function(err, user){
        if (err) return next(err);
        res.json(user);
    });
});
//update user
router.put('/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id,req.body,{new:true},function(err, modifiedUser){
        if (err) return next(err);
        res.json(modifiedUser);
    });
});
//delete user
router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id,function(err, deletedUser){
        if (err) return next(err);
        res.json(deletedUser);
    });
});

module.exports = router;
