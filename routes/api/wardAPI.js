var arg = 'Ward',
express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Item = mongoose.model(arg),
cb = require('../callback');

router.get('/', function(req, res, next) {
    Item.find(req.query).lean().sort('name')
    .populate('building','name')
    .exec(function(err, items){
        if(err){ return next(err); }
        var wards = [], ward;
        for (var i = 0; i < items.length; i++) {
            ward = items[i];
            wards.push({_id: ward._id, name: ward.name, building: ward.building.name });
        }
        res.json(wards);
    });
});
router.post('/', function(req, res, next) {
    //if (!req.body.name) { return next(cb("No name supplied for " + arg, 422)); }
    Item.create(req.body,function(err, item){
        if(err){ return next(err); }
        res.status(201).json(item);
    });
});
router.param('itemId', function(req, res, next, itemId) {
    Item.findById(itemId, function (err, item){
        if (err) { return next(err); }
        else if (item === null) { return next(cb(arg + " not found",404));}
        req.item = item;
        next();
    });
});
router.get('/:itemId', function(req, res, next) {
    res.json(req.item);
});
router.put('/:itemId', function(req, res, next) {
    if (!req.body.name) { return next(cb("No updated name supplied for " + arg, 422)); }
    req.item.name = req.body.name;
    req.item.save(function(err, item){
        if(err){ return next(err); }
        res.status(204).end();
    });
});
router.delete('/:itemId', function(req, res, next) {
    req.item.remove(function(err, item){
        if(err){ return next(err); }
        res.status(204).end();
    });
});

module.exports = router;
