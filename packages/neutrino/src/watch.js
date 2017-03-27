const Future = require('fluture');
const { watcher, validate } = require('./webpack');

// watch :: Object config -> Future (Array Error) ()
const watch = config => Future
  .of(config)
  .chain(validate)
  .chain(watcher);

module.exports = watch;
