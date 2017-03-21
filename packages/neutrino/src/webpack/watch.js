const webpack = require('webpack');
const ora = require('ora');
const { handle, logErrors } = require('./utils');

module.exports = config => new Promise((resolve) => {
  const compiler = webpack(config);
  const building = ora('Waiting for initial build to finish').start();

  compiler.watch(config.watchOptions || {}, handle((errors) => {
    building.succeed('Build completed');
    logErrors(errors);
  }));
});
