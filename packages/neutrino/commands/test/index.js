'use strict';

const getPreset = require('../../src/get-preset');
const Server = require('karma').Server;
const builder = require('../build');
const mochaBin = require('../../src/mocha');

const karma = (config, args, done) => {
  const karma = config.karma;

  delete config.karma;
  delete config.plugins;
  karma.webpack = config;
  karma.singleRun = !args.options.watch;
  karma.autoWatch = args.options.watch;

  if (args.files) {
    karma.files = args.files;
  }

  new Server(karma, done).start();
};

const mocha = (config, args, done) => {
  args.options.watch ?
    builder.watch(config, () => mochaBin(config, args), done) :
    builder.build(config, () => mochaBin(config, args, done));
};

module.exports = (args, done) => {
  const config = getPreset(args.options.preset);


  if (config.plugins.find(p => p.options && p.options.options && p.options.options.mocha)) {
    mocha(config, args, done);
  } else {
    karma(config, args, done);
  }
};
