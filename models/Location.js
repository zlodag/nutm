var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var WardSchema = new Schema({
    name: {type: String, required: true},
    building: {type: Schema.Types.ObjectId, ref: 'Building', required: true}
},{ versionKey: false });

var BuildingSchema = new Schema({
    name: {type: String, required: true, unique: true}
},{ versionKey: false });

mongoose.model('Ward', WardSchema);
mongoose.model('Building', BuildingSchema);
