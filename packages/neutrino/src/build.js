const webpack = require('webpack');
const Future = require('fluture');
const { webpackErrors } = require('./utils');

// build :: Object config -> Future (Array Error) Function
const build = config => Future((reject, resolve) => {
  const compiler = webpack(config);

  compiler.run((err, stats) => {
    const errors = webpackErrors(err, stats);

    errors.length ? reject(errors) : resolve(stats);
  });
});

module.exports = build;
