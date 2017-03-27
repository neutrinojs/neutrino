const merge = require('deepmerge');
const Future = require('fluture');
const { serve, validate } = require('./webpack');

// server :: Object config -> Future () Function
const devServer = config => Future
  .of(merge({ devServer: { host: 'localhost', port: 5000, noInfo: true } }, config))
  .chain(validate)
  .chain(serve);

module.exports = devServer;
