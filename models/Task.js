var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  name: {type: String, required: true},
  completed: Boolean,
  note: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', TaskSchema);
