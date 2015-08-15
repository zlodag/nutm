var express = require('express'),
router = express.Router(),
jwt = require('jsonwebtoken'),
crypto = require('crypto'),
passport = require('passport'),
JwtStrategy = require('passport-jwt').Strategy,
User = require('mongoose').model('User'),
cb = require('./callback'),
secret;

try {
  secret = crypto.randomBytes(256);
  // console.log('Have %d bytes of random data', secret.length);
} catch (ex) {
  secret = crypto.pseudoRandomBytes(256);
  // console.log('Have %d bytes of pseudorandom data', secret.length);
}

passport.use(new JwtStrategy({secretOrKey: secret}, function(jwt_payload, done) {
    User.findById(jwt_payload.sub, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            console.log('Authenticated as %s', user.fullname);
            done(null, user);
        } else {
            console.log('No user found')
            done(null, false);
            // or you could create a new account
        }
    });
}));

module.exports = function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return next(cb("No user or password supplied",422));
    }
    User.findOne({
        username: req.body.username
    }, '+password +salt', function(err, user){
        if (err) return next(err);
        //console.log(user);
        if (!user || !user.authenticate(req.body.password)) {
        // if (!user) {// || !user.authenticate(req.body.password)) {
            return next(cb("Incorrect user/password",422));
        } else {
            // console.log(user);
            console.log('Logged in as %s', user.fullname);
            var token = jwt.sign({
                name: user.fullname,
                admin: user.admin
            }, secret, {
                subject: user.id,
                // expiresInMinutes: 1440 //expires in 24 hours
                expiresInMinutes: 60
                //expiresInSeconds: 10
            });
            return res.json({
                // success:true,
                //message: 'Logged in as "' + user.name + '"',
                token: token
            });
        }
    });
};
