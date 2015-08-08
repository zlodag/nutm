var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var WardSchema = new Schema({
    name: {type: String, required: true}
});

var BuildingSchema = new Schema({
    name: {type: String, required: true, unique: true},
    wards: [WardSchema]
});

mongoose.model('Building', BuildingSchema);
