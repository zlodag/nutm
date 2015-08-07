var mongoose = require('mongoose'), Schema = mongoose.Schema;

var BuildingSchema = new Schema({
    _id: String
});

var WardSchema = new Schema({
    _id: String,
    building: {type: String, ref: 'Building', required: true}
});

var SpecialtySchema = new Schema({
    _id: String
});

function commentValidator(comment){
    return (
        this.type === 'add' ||
        this.type === 'accept' ||
        this.type === 'complete' ||
        comment.length
        );
}

var statusArray = ['add', 'accept','complete','cancel','comment'];
var statusOrder = {add: 1, accept: 2, complete: 3, cancel: 3};

var TaskSchema = new Schema({
    patient: {
        nhi: {type: String, required: true, match: /^[a-zA-Z]{3}[0-9]{4}$/, uppercase: true},
        ward: {type: String, ref: 'Ward', required: true},
        bed: {type: String, required: true, trim: true, uppercase: true},
        specialty: {type: String, ref: 'Specialty', required: true}
    },
    text: {type: String, required: true, trim: true},
    urgency: {type: Number, required: true, max: 3, min: 1},
    updates: [{
        user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String, validate: commentValidator, trim: true},
        type: {type: String, enum: statusArray, index: true, required: true}
    }]
});

TaskSchema.methods.getStatus = function(offset) {
    for (var i = this.updates.length - (1 + offset); i >= 0; i--) {
        var type = this.updates[i].type;
        if (type !== 'comment') {return type;}
    }
};

TaskSchema.pre('save', function(next) {
    if (this.updates.length === 0) {
        next(new Error('Updates array is empty'));
    } else if (this.updates.length === 1 && this.updates[0].type !== statusArray[0]) {
        next(new Error('The first update status must be ' + statusArray[0]));
    } else {
        var taskStatusList = [], currentOrder, i, currentType, x, previousType;
        for (i = 0; i < this.updates.length; i++) {
            currentType = this.updates[i].type;
            if (t === 'comment') {continue;}
            currentOrder = statusOrder[currentType];
            for (x = 0; x < taskStatusList.length; x++) {
                previousType = taskStatusList[x];
                if (currentOrder <= statusOrder[previousType]){
                    return next(new Error('Cannot ' + currentType + ' after ' + previousType));
                }
            }
            taskStatusList.push(currentType);
        }
        next();
    }
});

mongoose.model('Building', BuildingSchema);
mongoose.model('Ward', WardSchema);
mongoose.model('Specialty', SpecialtySchema);
mongoose.model('Task', TaskSchema);
