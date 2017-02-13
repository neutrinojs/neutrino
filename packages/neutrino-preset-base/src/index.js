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

module.exports = () => {
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

  return config;
};
