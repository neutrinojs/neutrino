const neutrino = require('../neutrino');
const middleware = require('.');

module.exports = neutrino({
  use: middleware(),
  options: {
    root: __dirname,
  },
}).eslintrc();
