var crypto = require('crypto'),
secret;

try {
  secret = crypto.randomBytes(256);
  // console.log('Have %d bytes of random data', secret.length);
} catch (ex) {
  secret = crypto.pseudoRandomBytes(256);
  // console.log('Have %d bytes of pseudorandom data', secret.length);
}

module.exports = {
    'database' : 'mongodb://localhost/tasks',
    'secret': secret
};