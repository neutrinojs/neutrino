const Future = require('fluture');
const { createWebpackWatcher, validateWebpackConfig } = require('./utils');

// watch :: Object config -> Future (Array Error) ()
const watch = config => Future
  .of(config)
  .chain(validateWebpackConfig)
  .chain(createWebpackWatcher);

module.exports = watch;
