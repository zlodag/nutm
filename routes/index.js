var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TaskManager', version: "0.0.1" });
});

module.exports = router;