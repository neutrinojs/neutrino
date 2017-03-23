const Future = require('fluture');
const { identity } = require('ramda');

// test :: Object options -> Future () Function
module.exports = () => Future.of(identity);
