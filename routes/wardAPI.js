var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Ward = mongoose.model('Ward'),
Building = mongoose.model('Building');

router.get('/', function(req, res, next) {
    Ward.find().sort({name: 1}).exec(function(err, wards){
        if(err){ return next(err); }
        res.json(wards);
    });
});
router.post('/', function(req, res, next) {
    if(!req.body.building){ return next(new Error('Incomplete request')); }
    Building.findById(req.body.building,function(err, building){
        if(err){ return next(err); }
        console.log('found building: %s', building.name);
        Ward.create({name: req.body.name, building: building.id}, function(err, ward){
            if(err){ return next(err); }
            building.wards.push(ward.id);
            building.save(function(err, building){
                if(err){ return next(err); }
                res.json(ward);
            });
        });
    });
});
router.get('/:id', function(req, res, next) {
    Ward.findById(req.params.id, function(err, ward){
        if(err){ return next(err); }
        res.json(ward);
    });
});
router.put('/:id', function(req, res, next) {
    Ward.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true},function(err, ward){
        if(err){ return next(err); }
        res.json(ward);
    });
});
router.delete('/:id', function(req, res, next) {
    Ward.findByIdAndRemove(req.params.id,function(err, ward){
        if(err){ return next(err); }
        Building.findById(ward.building,function(err,building){
            if(err){ return next(err); }
            building.wards.pull(ward.id);
            building.save(function(err,building){
                if(err){ return next(err); }
                res.json(ward);
            });
        });
    });
});

module.exports = router;