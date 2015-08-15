var express = require('express'),
router = express.Router(),

// crud = require('./api/CRUD'),
// buildingAPI = crud('Building'),
// wardAPI = crud('Ward'),
// specialtyAPI = crud('Specialty'),
// wall = require('./wall'),

taskAPI = require('./api/taskAPI'),

buildingAPI = require('./api/buildingAPI'),
wardAPI = require('./api/wardAPI'),
specialtyAPI = require('./api/specialtyAPI'),

userAPI = require('./api/userAPI'),
cb = require('./callback');

// router.use(function (req, res, next) {
//   console.log('%s accessed API: ', req.user, Date.now());
//   //if(req.body) {console.log('Request body: ', req.body);}
//   //req.user = {_id: "55c65b8d89ec4dc92e0619e1"};
//   next();
// });

// router.use(wall);

router.use('/task', taskAPI);
router.use('/building', buildingAPI);
router.use('/ward', wardAPI);
router.use('/specialty', specialtyAPI);
router.use('/user', userAPI);

router.use(function(req, res, next) {
  next(cb("Resource not found",404));
});

router.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = router;
