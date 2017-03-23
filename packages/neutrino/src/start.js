const { ifElse, propSatisfies } = require('ramda');
const devServer = require('./devServer');
const watch = require('./watch');

// start :: Object options -> Future (Array Error) Function
module.exports = ifElse(propSatisfies(Boolean, 'devServer'), devServer, watch);
