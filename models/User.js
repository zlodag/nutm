var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  admin: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);
