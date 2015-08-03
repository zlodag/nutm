var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'Non-Urgent Task Manager',
      version: "2.0.0"
  });
});

module.exports = router;
