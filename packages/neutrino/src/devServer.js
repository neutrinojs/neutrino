const merge = require('deepmerge');
const Future = require('fluture');
const { serve, validate } = require('./webpack');

// devServer :: (Object config -> Object api) -> Future () Function
const devServer = (config, { options }) => Future
  .of(merge({ devServer: { host: 'localhost', port: 5000, noInfo: !options.debug } }, config))
  .chain(validate)
  .chain(serve);

module.exports = devServer;
