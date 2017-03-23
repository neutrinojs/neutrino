const webpack = require('webpack');
const Future = require('fluture');
const { webpackErrors } = require('./utils');

// watch :: Object config -> Future (Array Error) ()
const watch = config => new Future((reject, resolve) => {
  const compiler = webpack(config);

  compiler.watch(config.watchOptions || {}, (err, stats) => {
    const errors = webpackErrors(err, stats);

    errors.length ? reject(errors) : resolve(compiler);
  });
});

module.exports = watch;
