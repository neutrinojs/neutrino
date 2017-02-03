'use strict';

const preset = require('neutrino-preset-web');
const merge = require('deepmerge');
const webpackMerge = require('webpack-merge').smart;
const path = require('path');
const webpack = require('webpack');

const MODULES = path.join(__dirname, 'node_modules');
const eslintLoader = preset.module.rules.find(r => r.use && r.use.includes('eslint'));
const babelLoader = preset.module.rules.find(r => r.use && r.use.loader && r.use.loader.includes('babel'));

eslintLoader.test = /\.jsx?$/;
babelLoader.test = /\.jsx?$/;
babelLoader.use.options.presets.push(require.resolve('babel-preset-stage-0'));
babelLoader.use.options.presets.push(require.resolve('babel-preset-react'));

const config = webpackMerge(preset, {
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: path.join(__dirname, 'eslint.js')
        }
      }
    })
  ],
  resolve: {
    modules: [MODULES],
    extensions: ['.jsx']
  },
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window'
  }
});

if (process.env.NODE_ENV === 'development') {
  config.entry.index.unshift(require.resolve('react-hot-loader/patch'));
  babelLoader.use.options.plugins.push(require.resolve('react-hot-loader/babel'));
}

module.exports = config;
