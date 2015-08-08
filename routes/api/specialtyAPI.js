var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Specialty = mongoose.model('Specialty'),
cb = require('../callback');

router.get('/', function(req, res, next) {
    Specialty.find().lean().sort('name').exec(function(err, specialties){
        if(err){ return next(err); }
        res.json(specialties);
    });
});
router.post('/', function(req, res, next) {
    if (!req.body.name) { return next(cb("No name supplied for specialty",422)); }
    Specialty.create({name: req.body.name},function(err, specialty){
        if(err){ return next(err); }
        res.status(201).json(specialty);
    });
});
router.param('specialtyId', function(req, res, next, specialtyId) {
    Specialty.findById(specialtyId, function (err, specialty){
        if (err) { return next(err); }
        else if (specialty === null) { return next(cb("Specialty not found",404));}
        req.specialty = specialty;
        next();
    });
});
router.get('/:specialtyId', function(req, res, next) {
    res.json(req.specialty);
});
router.put('/:specialtyId', function(req, res, next) {
    if (!req.body.name) { return next(cb("No updated name supplied for specialty",422)); }
    req.specialty.name = req.body.name;
    req.specialty.save(function(err, specialty){
        if(err){ return next(err); }
        res.status(204).end();
    });
});
router.delete('/:specialtyId', function(req, res, next) {
    req.specialty.remove(function(err, specialty){
        if(err){ return next(err); }
        res.status(204).end();
    });
});

module.exports = router;