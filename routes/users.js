var express = require('express');
var router = express.Router();

var User = require('../models/User');
var checkadmin = require('./checkadmin');

//see current user
router.get('/me/', function(req, res, next) {
    User.findById(req.decoded.sub,function(err, user){
        if (err) return next(err);
        res.json(user);
    });
});
//update username
router.put('/me/un', function(req, res, next) {
    if (!req.body.name) return res.json({success:false, message: 'you did not provide a username'});
    User.findByIdAndUpdate(req.decoded.sub,{name:req.body.name},{new:true},function(err, newMe){
        if (err) return next(err);
        res.json({success:true, message: 'username updated to "' + newMe.name + '"'});
    });
});
//update password
router.put('/me/pw', function(req, res, next) {
    if (!req.body.password) return res.json({success:false, message: 'you did not provide a password'});
    User.findByIdAndUpdate(req.decoded.sub,{password:req.body.password},{new:true},function(err, newMe){
        if (err) return next(err);
        res.json({success:true, message: 'Password updated'});
    });
});

router.use(checkadmin);

//see all users
router.get('/', function(req, res, next) {
    User.find(function(err, users){
        res.json(users);
    });
});

//create user
router.post('/', function(req, res, next) {
    User.create(req.body, function(err, newUser){
        if (err) {
		//res.json({'message':'there was an error', 'input': req.body, 'error':err});
		return next(err);
	}
        res.json(newUser);
    });
});
//retrieve user
router.get('/:id/', function(req, res, next) {
    User.findById(req.params.id,function(err, user){
        if (err) return next(err);
        res.json(user);
    });
});
//update user
router.put('/:id/', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id,req.body,{new:true},function(err, modifiedUser){
        if (err) return next(err);
        res.json(modifiedUser);
    });
});
//delete user
router.delete('/:id/', function(req, res, next) {
    User.findByIdAndRemove(req.params.id,function(err, deletedUser){
        if (err) return next(err);
        res.json(deletedUser);
    });
});

module.exports = router;
