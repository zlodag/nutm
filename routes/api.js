var express = require('express'),
router = express.Router(),
taskAPI = require('./api/taskAPI.js'),

// crud = require('./api/CRUD'),
// buildingAPI = crud('Building'),
// wardAPI = crud('Ward'),
// specialtyAPI = crud('Specialty'),

buildingAPI = require('./api/buildingAPI.js'),
wardAPI = require('./api/wardAPI.js'),
specialtyAPI = require('./api/specialtyAPI.js'),

userAPI = require('./api/userAPI.js'),
cb = require('./callback');

router.use(function (req, res, next) {
  // console.log('Accessed API: ', Date.now());
  //if(req.body) {console.log('Request body: ', req.body);}
  req.user = {_id: "55c65b8d89ec4dc92e0619e1"};
  next();
});

router.use('/tasks', taskAPI);
router.use('/building', buildingAPI);
router.use('/ward', wardAPI);
router.use('/specialty', specialtyAPI);
router.use('/user', userAPI);

router.use(function(req, res, next) {
  next(cb("Resource not found",404));
});

router.use(function(err, req, res, next) {
    console.log(err.message);
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message
    });
});

module.exports = router;