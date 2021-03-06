var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/User');

router.post('/authenticate', function(req, res, next) {
	User.findOne({
		name: req.body.username,
		password: req.body.password
	}, function(err, user){
		if (err) return next(err);
		if (!user) {
			res.json({success:false, message: 'Authentication failed, incorrect user/password'});
		} else {
			var token = jwt.sign({name: user.name, admin:user.admin},config.secret, {
				subject: user.id,
				// expiresInMinutes: 1440 //expires in 24 hours
				expiresInMinutes: 60
				//expiresInSeconds: 10
			});
			res.json({
				success:true,
				//message: 'Logged in as "' + user.name + '"',
				token: token
			});
		}
	});
});

module.exports = router;
