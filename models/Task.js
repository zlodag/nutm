var mongoose = require('mongoose'), Schema = mongoose.Schema;

var buildingSchema = new Schema({
    name: {type: String, required: true}
});

var wardSchema = new Schema({
    name: {type: String, required: true},
    building: {type: Schema.Types.ObjectId, ref: 'Building', required: true},
});

var specialtySchema = new Schema({
    name: {type: String, required: true}
});

var taskSchema = new Schema({
    patient: {
        nhi: {type: String, required: true, match: /^[A-Z]{3}[0-9]{4}$/},
        ward: {type: Schema.Types.ObjectId, ref: 'Ward', required: true},
        bed: {type: String, required: true},
        specialty: {type: Schema.Types.ObjectId, ref: 'Specialty', required: true}
    },
    text: {type: String, required: true},
    urgency: {type: Number, required: true},
    added: {
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String}
    },
    accepted: {
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String}
    },
    completed: {
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String}
    },
    cancelled: {
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String, required: true}
    },
    comments: [{
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String, required: true}
    }]
});

module.exports = mongoose.model('Building', buildingSchema);
module.exports = mongoose.model('Ward', wardSchema);
module.exports = mongoose.model('Specialty', specialtySchema);
module.exports = mongoose.model('Task', taskSchema);
