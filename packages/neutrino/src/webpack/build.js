const webpack = require('webpack');
const { handle, logErrors, logStats } = require('./utils');

module.exports = config => new Promise((resolve, reject) => {
  const compiler = webpack(config);

  compiler.run(handle((errors, stats) => (
    errors.length ? reject(logErrors(errors)) : resolve(logStats(stats))
  )));
});
