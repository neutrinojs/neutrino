'use strict';

const Config = require('webpack-chain');
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const webpack = require('webpack');
const lint = require('./eslint');

const CWD = process.cwd();
const BUILD = path.join(CWD, 'build');
const PROJECT_MODULES = path.join(CWD, 'node_modules');
const BASE_MODULES = path.join(__dirname, '../node_modules');
const SRC = path.join(CWD, 'src');
const TEST = path.join(CWD, 'test');

const config = new Config();

config
  .context(CWD)
  .entry('index')
    .add(path.join(SRC, 'index.js'))
    .end()
  .output
    .path(path.join(process.cwd(), 'build'))
    .filename('[name].bundle.js')
    .chunkFilename('[id].[chunkhash].js')
    .end()
  .resolve
    .modules
      .add(PROJECT_MODULES)
      .add(BASE_MODULES)
      .end()
    .extensions
      .add('.js')
      .add('json')
      .end()
    .end()
  .resolveLoader
    .modules
      .add(PROJECT_MODULES)
      .add(BASE_MODULES);

config
  .module
    .rule('lint')
      .test(/\.js$/)
      .pre()
      .include(SRC)
      .loader('eslint', require.resolve('eslint-loader'), Object.assign({
        failOnError: process.env.NODE_ENV !== 'development',
        emitWarning: process.env.NODE_ENV !== 'development',
        emitError: process.env.NODE_ENV !== 'development'
      }, lint));

config
  .module
    .rule('compile')
      .test(/\.js$/)
      .include(SRC, TEST)
      .loader('babel', require.resolve('babel-loader'), {
        presets: [
          [require.resolve('babel-preset-env'), { modules: false, targets: {} }]
        ],
        plugins: [],
        env: {
          test: {
            plugins: [
              // FIXME: This currently breaks the coverage
              //[require.resolve('babel-plugin-istanbul'), { exclude: ['test/**/*'] }]
            ]
          }
        }
      });

if (process.env.NODE_ENV === 'development') {
  config.devtool('eval');
} else {
  config.output.filename('[name].[chunkhash].bundle.js');

  config
    .plugin('copy')
    .use(CopyPlugin, [{ context: SRC, from: `**/*` }], { ignore: ['*.js*'] });

  config
    .plugin('progress')
    .use(ProgressBarPlugin);

  config
    .plugin('clean')
    .use(CleanPlugin, [BUILD], { root: CWD });
}

module.exports = config;
