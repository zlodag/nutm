var mongoose = require('mongoose'),
Schema = mongoose.Schema,
// Error = mongoose.Error,

CommentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    time: {type: Date, default: Date.now, required: true},
    comment: {type: String, trim: true, required: true},
}),
// CommentOptUpdateSchema = new Schema({
//     user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
//     time: {type: Date, default: Date.now, required: true},
//     comment: {type: String, trim: true},
// }),
TaskSchema = new Schema({
    patient: {
        nhi: {type: String, required: true, match: /^[a-zA-Z]{3}[0-9]{4}$/, uppercase: true},
        ward: {type: Schema.Types.ObjectId, ref: 'Ward', required: true},
        bed: {type: String, required: true, trim: true, uppercase: true},
        specialty: {type: Schema.Types.ObjectId, ref: 'Specialty', required: true}
    },
    text: {type: String, required: true, trim: true},
    urgency: {type: Number, required: true},
    added: {
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        time: {type: Date, default: Date.now, required: true},
        comment: {type: String, trim: true},
    },
    accepted: {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        time: {type: Date},
        comment: {type: String, trim: true},
    },
    completed: {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        time: {type: Date},
        comment: {type: String, trim: true},
    },
    cancelled: {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        time: {type: Date},
        comment: {type: String, trim: true},
    },
    comments: [CommentSchema]
});

TaskSchema.path('urgency').validate(function(x){
    return ((x % 1 === 0) && (x >= 0) && (x <=3 ));
}, 'Urgency must be a valid number');

// TaskSchema.path('patient.ward').validate(function(id){
//     var status = mongoose.model('Ward').findById(id, function(err, ward){
//         console.log('The supplied ID was: %s',id);
//         console.log('The found ward was: %s',ward);
//         console.log('The validator returns: %s',(!!err || !!ward));
//         return (!!err || !!ward);
//     });
//     console.log('The validator returns: %s', status);
//     return status;
// }, 'Ward ID must be valid');

TaskSchema.methods.getStatus = function() {
    if (this.cancelled.user) {return 'cancelled';}
    else if (this.completed.user) {return 'completed';}
    else if (this.accepted.user) {return 'accepted';}
    else if (this.added.user) {return 'added';}
};
TaskSchema.methods.updateStatus = function(status, user, comment, callback) {
    // console.log('The parameters are: ',status, user, comment, callback);
    if (!status) {
        // console.log('Error: ', Error);
        // var err = new Error('No status submitted');
        // console.log('error: ', err);
        // return callback(err);
        return callback(new Error('No status submitted'));
    } else if (
        (status !== 'added') &&
        (status !== 'accepted') &&
        (status !== 'completed') &&
        (status !== 'cancelled')
    ) {
        return callback(new Error('Invalid status submitted: ' + status));
    } else if (
        (status === 'added' && (this.added.user || this.accepted.user || this.completed.user || this.cancelled.user)) ||
        (status === 'accepted' && (this.accepted.user || this.completed.user || this.cancelled.user)) ||
        ((status === 'completed' || status === 'cancelled') && (this.completed.user || this.cancelled.user))
    ) {
        return callback(new Error('Unable to mark this task as ' + status + ' as it has already been ' + this.getStatus()));
    } else {
        if (comment){this[status].comment = comment;}
        else if (status === 'cancelled') {
            return callback(new Error('Comment must be provided for a cancelled task'));
        }
        this[status].user = user;
        this[status].time = Date.now();
        this.save(callback);
    }
};

// TaskSchema.pre('save', function(next) {
//     if (this.isModified('patient.ward')) {
//         var ward = mongoose.model('Ward').findById(this.patient.ward);
//         console.log(ward);
//         if (!ward){}
//     }
//     next();
// });

// TaskSchema.pre('save', function(next) {
//     if (this.updates.length === 0) {
//         next(new Error('Updates array is empty'));
//     } else if (this.updates.length === 1 && this.updates[0].type !== statusArray[0]) {
//         next(new Error('The first update status must be ' + statusArray[0]));
//     } else {
//         var taskStatusList = [], currentOrder, i, currentType, x, previousType;
//         for (i = 0; i < this.updates.length; i++) {
//             currentType = this.updates[i].type;
//             if (t === 'comment') {continue;}
//             currentOrder = statusOrder[currentType];
//             for (x = 0; x < taskStatusList.length; x++) {
//                 previousType = taskStatusList[x];
//                 if (currentOrder <= statusOrder[previousType]){
//                     return next(new Error('Cannot ' + currentType + ' after ' + previousType));
//                 }
//             }
//             taskStatusList.push(currentType);
//         }
//         next();
//     }
// });

mongoose.model('Task', TaskSchema);
