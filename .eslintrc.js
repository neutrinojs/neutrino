const neutrino = require('./packages/neutrino');

module.exports = neutrino({
  use: require('./.neutrinorc'), // eslint-disable-line global-require
  options: {
    root: __dirname
  }
}).eslintrc();
