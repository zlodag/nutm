var crypto = require('crypto'),
secret;

try {
  secret = crypto.randomBytes(256);
} catch (err) {
  secret = crypto.pseudoRandomBytes(256);
}

module.exports = secret;
