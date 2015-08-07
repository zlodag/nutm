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
        nhi: {type: String, required: true, match: /^[a-zA-Z]{3}[0-9]{4}$/, uppercase: true},
        ward: {type: Schema.Types.ObjectId, ref: 'Ward', required: true},
        bed: {type: String, required: true, trim: true, uppercase: true},
        specialty: {type: Schema.Types.ObjectId, ref: 'Specialty', required: true}
    },
    text: {type: String, required: true, trim: true},
    urgency: {type: Number, required: true, max: 3, min: 1},
    added: {
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String, trim: true}
    },
    accepted: {
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String, trim: true}
    },
    completed: {
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String, trim: true}
    },
    cancelled: {
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String, required: true, trim: true}
    },
    comments: [{
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String, required: true, trim: true}
    }]
});
// taskSchema.methods.accept = function (block, cb) {
//   this.accepted = block;
//   this.save(cb);
// }

module.exports = mongoose.model('Building', buildingSchema);
module.exports = mongoose.model('Ward', wardSchema);
module.exports = mongoose.model('Specialty', specialtySchema);
module.exports = mongoose.model('Task', taskSchema);
