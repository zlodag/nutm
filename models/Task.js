var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    body: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, required: true},
    created: {type: Date, default: Date.now}
});

var taskSchema = new mongoose.Schema({
  name: {type: String, required: true},
  completed: {type: Boolean, default: false},
  note: String,
  comments: [commentSchema],
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
