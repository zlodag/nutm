var express = require('express'),
jwt = require('jsonwebtoken'),
User = require('mongoose').model('User'),
secret = require('../secret'),
createToken = function(user){
    console.log('Site: %s', user.site);
    return jwt.sign(
        {
            name: user.fullname,
            site: user.site,
            admin: user.admin
        },
        secret,
        {
            subject: user.id,
            // expiresInMinutes: 1440 //expires in 24 hours
            expiresInMinutes: 60,
            noTimestamp: true
            //expiresInSeconds: 10
        }
    );
},
authenticate = function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        // return next(cb("No user or password supplied",422));
        return res.status(400).send("You must send the username and the password");
    }
    User.findOne({
        username: req.body.username
    }, '+password +salt', function(err, user){
        if (err) return next(err);
        //console.log(user);
        if (!user || !user.authenticate(req.body.password)) {
        // if (!user) {// || !user.authenticate(req.body.password)) {
            return res.status(401).send("Incorrect username/password");
            // return next(cb("Incorrect user/password",422));
        }
        // console.log(user);
        console.log('Logged in as %s', user.fullname);
        var token = createToken(user);
        return res.status(201).send(token);
    });
};

module.exports = authenticate;
