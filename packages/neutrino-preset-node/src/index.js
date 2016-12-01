'use strict';

const merge = require('webpack-merge').smart;
const preset = require('neutrino-preset-base');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const MODULES = path.join(__dirname, '../node_modules');

const config = merge(preset, {
  target: 'node',
  output: {
    libraryTarget: 'commonjs2'
  },
  eslint: {
    configFile: path.join(__dirname, 'eslint.js')
  },
  resolve: {
    root: [MODULES]
  },
  resolveLoader: {
    root: [MODULES]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.BannerPlugin(`require('source-map-support').install();`, { raw: true, entryOnly: true })
  ],
  externals: [nodeExternals({ modulesFromFile: true })],
  mocha: {
    reporter: 'spec',
    ui: 'tdd',
    bail: true
  }
});

const babelLoader = config.module.loaders.find(l => l.loader.includes('babel'));

if (!babelLoader.query.plugins) {
  babelLoader.query.plugins = [];
}

babelLoader.query.plugins.push(require.resolve('babel-plugin-transform-runtime'));
babelLoader.query.plugins.push(require.resolve('babel-plugin-transform-async-to-generator'));

module.exports = config;
