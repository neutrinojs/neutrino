const neutrino = require('../neutrino');

module.exports = neutrino({
  use: require('.'), // eslint-disable-line global-require
  options: {
    root: __dirname
  }
}).eslintrc();
