'use strict';

const getPreset = require('../../src/get-preset');
const Server = require('karma').Server;

module.exports = (args, done) => {
  const config = getPreset(args.options.preset);
  const karma = config.karma;

  delete config.karma;
  delete config.plugins;
  karma.webpack = config;
  karma.singleRun = !args.options.watch;
  karma.autoWatch = args.options.watch;

  new Server(karma, done).start();
};
