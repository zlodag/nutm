var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    body: String,
    user: mongoose.Schema.ObjectId,
    created: {type: Date, default: Date.now}
});
var taskSchema = new mongoose.Schema({
  name: {type: String, required: true},
  completed: Boolean,
  note: String,
  comments: [commentSchema],
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
