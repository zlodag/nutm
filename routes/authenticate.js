var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/User');

router.post('/authenticate', function(req, res, next) {
	User.findOne({
		name: req.body.name,
		password: req.body.password
	}, function(err, user){
		if (err) return next(err);
		if (!user) {
			res.json({success:false, message: 'Authentication failed, incorrect user/password'});
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
	});
});

module.exports = router;
