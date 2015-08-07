var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
    name: {
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    salt: String,
    site: {type: String, required: true, index: true},
    admin: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
});

UserSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});

UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

UserSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

mongoose.model('User', UserSchema);