const Future = require('fluture');
const { webpackCompile, validateWebpackConfig } = require('./utils');

// build :: Object config -> Future (Array Error) Function
const build = config => Future
  .of(config)
  .chain(validateWebpackConfig)
  .chain(webpackCompile);

module.exports = build;
