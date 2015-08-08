var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
    name: {
        first: {type: String, required: true, trim: true},
        last: {type: String, required: true, trim: true}
    },
    username: {type: String, required: true, unique: true, trim: true, minlength: 6},
    password: {type: String, required: true, minlength: 6, select: false},
    salt: {type: String, select: false},
    site: {type: String, required: true, index: true, trim: true},
    admin: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
});

UserSchema.virtual('fullname').get(function () {
  return this.name.first + ' ' + this.name.last;
});

UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

UserSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        console.log('password pre-hash: %s', this.password);
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
        console.log('password post-hash: %s', this.password);
    }
    next();
});

mongoose.model('User', UserSchema);