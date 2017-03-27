const Future = require('fluture');
const { compile, validate } = require('./webpack');

// build :: Object config -> Future (Array Error) Function
const build = config => Future
  .of(config)
  .chain(validate)
  .chain(compile);

module.exports = build;
