var mongoose = require('mongoose'),
Schema = mongoose.Schema,

CommentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    time: {type: Date, default: Date.now, required: true},
    comment: {type: String, trim: true, required: true},
},{ versionKey: false }),

TaskSchema = new Schema({
    patient: {
        name: {type: String, required: true, trim: true},
        nhi: {type: String, required: true, match: /^[a-zA-Z]{3}[0-9]{4}$/, uppercase: true},
        ward: {type: Schema.Types.ObjectId, ref: 'Ward', required: true},
        bed: {type: String, required: true, trim: true, maxlength: 3, uppercase: true},
        specialty: {type: Schema.Types.ObjectId, ref: 'Specialty', required: true}
    },
    text: {type: String, required: true, trim: true},
    urgency: {type: Number, required: true},
    added: {
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        time: {type: Date, default: Date.now, required: true}
    },
    accepted: {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        time: {type: Date}
    },
    completed: {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        time: {type: Date}
    },
    cancelled: {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        time: {type: Date},
        comment: {type: String, trim: true}
    },
    comments: [CommentSchema]
});

TaskSchema.path('urgency').validate(function(x){
    return ((x % 1 === 0) && (x >= 0) && (x <=3 ));
}, 'Urgency must be a valid number');
TaskSchema.methods.getStatus = function() {
    if (this.cancelled.user) {return 'cancelled';}
    else if (this.completed.user) {return 'completed';}
    else if (this.accepted.user) {return 'accepted';}
    else if (this.added.user) {return 'added';}
};
TaskSchema.methods.updateStatus = function(status, user, comment, callback) {
    if (!status) {
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
        if (status === 'cancelled') {
            if (!comment){
                return callback(new Error('Comment must be provided for a cancelled task'));
            }
            this[status].comment = comment;
        }
        this[status].user = user;
        this[status].time = Date.now();
        this.save(callback);
    }
};

mongoose.model('Task', TaskSchema);
