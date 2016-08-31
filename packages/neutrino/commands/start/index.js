'use strict';

const webpack = require('webpack');
const build = require('../build');

module.exports = (args, done) => {
  // Right now the main point of having this `start` entry point is to ensure that
  // NODE_ENV is development.
  // TODO: consolidate build command to accept a --watch flag which correctly handles NODE_ENV
  return build(args, done);
};
