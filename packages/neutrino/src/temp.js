const crypto = require('crypto');
const os = require('os');
const path = require('path');

module.exports = () =>  path.join(os.tmpdir(), crypto.randomBytes(8).toString('hex'));
