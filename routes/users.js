var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var config = require('../config');
var User = require('../models/User');

router.post('/authenticate', function(req, res, next) {
    User.findOne({
        name: req.body.name,
    }, function(err, user){
        if (err) return next(err);
        if (!user) {
            // no user was found
            res.json({success:false, message: 'Authentication failed, user not found'});
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({success:false, message: 'Authentication failed, incorrect password'});
            } else {
                var token = jwt.sign({admin:user.admin},config.secret, {
                    subject: user.id,
                    expiresInMinutes: 1440 //expires in 24 hours
                });
                res.json({
                    success:true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

// route middleware to verify a token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return next(err);
        //return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});
router.get('/me/', function(req, res, next) {
    User.findById(req.decoded.sub,function(err, user){
        if (err) return next(err);
        res.json(user);
    });
});
router.put('/me/', function(req, res, next) {
    User.findByIdAndUpdate(req.decoded.sub,req.body,{new:true},function(err, newMe){
        if (err) return next(err);
        res.json(newMe);
    });
});
router.use(function(req, res, next) {
    if (req.decoded.admin) {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: 'You need to be admin to do that.' 
        });
    }
});
router.get('/', function(req, res, next) {
    User.find(function(err, users){
        res.json(users);
    });
});
router.put('/:id/', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id,req.body,{new:true},function(err, modifiedUser){
        if (err) return next(err);
        res.json(modifiedUser);
    });
});
router.delete('/:id/', function(req, res, next) {
    User.findByIdAndRemove(req.params.id,function(err, deletedUser){
        if (err) return next(err);
        res.json(deletedUser);
    });
});
router.post('/', function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err){
        if (err) return next(err);
        console.log('User saved successfully');
        res.json({success:true, user:user});
    });
});

module.exports = router;
