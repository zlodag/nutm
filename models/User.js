var mongoose = require('mongoose'), Schema = mongoose.Schema;

var siteSchema = new Schema({
    name: {type: String, required: true}
});

var userSchema = new Schema({
    fullname: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    site: {type: Schema.Types.ObjectId, ref: 'Site', required: true},
    admin: {type: Boolean, default: false}
});

module.exports = mongoose.model('Site', siteSchema);
module.exports = mongoose.model('User', userSchema);