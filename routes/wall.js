var express = require('express'),
router = express.Router(),
_ = require('lodash'),
jwt = require('jsonwebtoken'),
cb = require('./callback'),
User = require('mongoose').model('User'),
secret = require('../secret');

module.exports = function(req, res, next) {
	// verify a token symmetric
	var header = req.get('authorization');
	if (!header) {
		return next(cb("Authorization header required",422));
	}
	var match = header.match(/^(?:JWT )(.*)/);
	if (!match) {
		return next(cb("Authorization header malformed",422));
	}
	var token = match[1];
	console.log('Token: %s', token);
	jwt.verify(token, secret, function(err, decoded) {
		if (err) { return next(cb(err,422)); }
	  	console.log(decoded);
  		return res.end();
	});
};
