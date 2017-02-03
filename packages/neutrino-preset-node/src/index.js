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
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    modules: [MODULES]
  },
  resolveLoader: {
    modules: [MODULES]
  },
  devtool: 'source-map',
  node: {
    __filename: false,
    __dirname: false
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: { configFile: path.join(__dirname, 'eslint.js') },
        emitError: true,
        failOnError: true,
        mocha: {
          reporter: 'spec',
          ui: 'tdd',
          bail: true
        }
      }
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: true
    })
  ],
  externals: [nodeExternals()],
  performance: {
    hints: false
  }
});

const babelLoader = config.module.rules.find(r => r.use && r.use.loader && r.use.loader.includes('babel'));

if (!babelLoader.use.options.plugins) {
  babelLoader.use.options.plugins = [];
}

babelLoader.use.options.plugins.push(
  require.resolve('babel-plugin-transform-runtime'),
  require.resolve('babel-plugin-transform-async-to-generator')
);

module.exports = config;
