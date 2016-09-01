'use strict';

const merge = require('webpack-merge').smart;
const preset = require('neutrino-preset-base');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = merge(preset, {
  target: 'node',
  devtool: process.env.NODE_ENV === 'production' ? '#eval-source-map' : null,
  externals: [nodeExternals({ modulesFromFile: true })],
  eslint: {
    configFile: path.join(__dirname, '../config/eslint.js')
  },
  mocha: {
    recursive: true,
    reporter: 'spec',
    ui: 'tdd',
    bail: true
  }
});
