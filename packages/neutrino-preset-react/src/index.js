'use strict';

const preset = require('neutrino-preset-web');
const merge = require('deepmerge');
const webpackMerge = require('webpack-merge').smart;
const path = require('path');
const webpack = require('webpack');

const MODULES = path.join(__dirname, '../node_modules');
const eslintLoader = preset.module.rules.find(r => r.use && r.use.loader && r.use.loader.includes('eslint'));
const babelLoader = preset.module.rules.find(r => r.use && r.use.loader && r.use.loader.includes('babel'));

eslintLoader.test = /\.jsx?$/;
babelLoader.test = /\.jsx?$/;
babelLoader.use.options.presets.push(require.resolve('babel-preset-stage-0'));
babelLoader.use.options.presets.push(require.resolve('babel-preset-react'));

eslintLoader.use.options = merge(eslintLoader.use.options, {
  plugins: ['react'],
  extends: [
    'plugin:react/recommended'
  ],
  settings: {
    pragma: 'React',
    version: '15.0'
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  },
  rules: {
    'react/prop-types': ['off'],

    // specify whether double or single quotes should be used in JSX attributes
    // http://eslint.org/docs/rules/jsx-quotes
    'jsx-quotes': ['error', 'prefer-double']
  }
});

const config = webpackMerge(preset, {
  resolve: {
    modules: [MODULES],
    extensions: ['.jsx']
  },
  resolveLoader: {
    modules: [MODULES]
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
