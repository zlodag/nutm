var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Task = mongoose.model('Task');

router.use(function (req, res, next) {
  console.log('Accessed tasks API: ', Date.now());
  next();
});

router.get('/', function(req, res, next) {
    Task.find(function(err, tasks){
        if(err){ return next(err); }
        res.json(tasks);
    });
});

module.exports = router;