var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var SpecialtySchema = new Schema({
    name: {type: String, required: true, unique: true}
});

mongoose.model('Specialty', SpecialtySchema);