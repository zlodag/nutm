var express = require('express'),
router = express.Router(),
taskAPI = require('./api/taskAPI.js'),
locationAPI = require('./api/locationAPI.js'),
specialtyAPI = require('./api/specialtyAPI.js'),
userAPI = require('./api/userAPI.js'),
cb = require('./callback');

// router.use(function (req, res, next) {
//   // console.log('Accessed API: ', Date.now());
//   if(req.body) {console.log('Request body: ', req.body);}
//   next();
// });

router.use('/tasks', taskAPI);
router.use('/location', locationAPI);
router.use('/specialty', specialtyAPI);
router.use('/user', userAPI);

router.use(function(req, res, next) {
  next(cb("Resource not found",404));
});

router.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message
    });
});

module.exports = router;