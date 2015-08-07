var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var WardSchema = new Schema({
    name: {type: String, required: true, unique: true},
    building: {type: Schema.Types.ObjectId, ref: 'Building', required: true}
});

var BuildingSchema = new Schema({
    name: {type: String, required: true, unique: true},
    wards: [{type: Schema.Types.ObjectId, ref: 'Ward'}]
});

var SpecialtySchema = new Schema({
    name: {type: String, required: true, unique: true}
});

mongoose.model('Ward', WardSchema);
mongoose.model('Building', BuildingSchema);
mongoose.model('Specialty', SpecialtySchema);