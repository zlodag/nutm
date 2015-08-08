var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Building = mongoose.model('Building'),
cb = require('../callback');

router.get('/', function(req, res, next) {
    Building.find().lean().sort('name').exec(function(err, buildings){
        if(err){ return next(err); }
        res.json(buildings);
    });
});
router.post('/', function(req, res, next) {
    if (!req.body.name) { return next(cb("No name supplied for building",422)); }
    Building.create({name: req.body.name},function(err, building){
        if(err){ return next(err); }
        res.status(201).json(building);
    });
});
router.param('buildingId', function(req, res, next, buildingId) {
    Building.findById(buildingId, function (err, building){
        if (err) { return next(err); }
        else if (building === null) { return next(cb("Building not found",404));}
        req.building = building;
        next();
    });
});
router.get('/:buildingId', function(req, res, next) {
    res.json(req.building);
});
router.put('/:buildingId', function(req, res, next) {
    if (!req.body.name) { return next(cb("No updated name supplied for building",422)); }
    req.building.name = req.body.name;
    req.building.save(function(err, building){
        if(err){ return next(err); }
        res.status(204).end();
    });
});
router.delete('/:buildingId', function(req, res, next) {
    req.building.remove(function(err, building){
        if(err){ return next(err); }
        res.status(204).end();
    });
});
router.post('/:buildingId', function(req, res, next) {
    if (!req.body.name) { return next(cb("No name supplied for ward",422)); }
    req.building.wards.push({name: req.body.name});
    req.building.save(function(err, building){
        if(err){ return next(err); }
        res.status(201).json(building);
    });
});

router.param('wardId', function(req, res, next, wardId) {
    var ward = req.building.wards.id(wardId);
    if (ward === null) { return next(cb("Ward not found",404)); }
    req.ward = ward;
    next();
});
router.get('/:buildingId/:wardId', function(req, res, next) {
    res.json(req.ward);
});
router.put('/:buildingId/:wardId', function(req, res, next) {
    if (!req.body.name) { return next(cb("No updated name supplied for ward",422)); }
    req.ward.name = req.body.name;
    req.building.save(function(err, building){
        if(err){ return next(err); }
        res.status(204).end();
    });
});
router.delete('/:buildingId/:wardId', function(req, res, next) {
    req.ward.remove();
    req.building.save(function(err){
        if(err){ return next(err);}
        res.status(204).end();
    });
});

module.exports = router;