var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Building = mongoose.model('Building');

router.get('/', function(req, res, next) {
    Building.find(function(err, buildings){
        if(err){ return next(err); }
        var opts = [{ path: 'wards', select: 'name' }];
        Building.populate(buildings, opts, function(err, buildings){
            res.json({buildings:buildings});
        });
    });
});
router.post('/', function(req, res, next) {
    Building.create({name: req.body.name},function(err, building){
        if(err){ return next(err); }
        res.json(building);
    });
});
router.get('/:id', function(req, res, next) {
    Building.findById(req.params.id, function(err, building){
        if(err){ return next(err); }
        building.populate({path:'wards',select:'name'}, function(err, building){
            if(err){ return next(err); }
            res.json(building);
        })
    });
});
router.put('/:id', function(req, res, next) {
    Building.findByIdAndUpdate(req.params.id,{name: req.body.name},{new: true},function(err, building){
        if(err){ return next(err); }
        res.json(building);
    });
});
router.delete('/:id', function(req, res, next) {
    Building.findByIdAndRemove(req.params.id,function(err, building){
        if(err){ return next(err); }
        res.json(building);
    });
});

module.exports = router;