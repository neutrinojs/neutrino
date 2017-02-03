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

// Polyfill based on Node.js LTS 6.9.0
babelLoader.use.options.presets[0][1].targets.node = 6.9;

const eslintLoader = config.module.rules.find(r => r.use && r.use.loader && r.use.loader.includes('eslint'));

eslintLoader.use.options.env.node = true;

Object.assign(eslintLoader.use.options.rules, {
  // enforce return after a callback
  'callback-return': 'off',

  // require all requires be top-level
  // http://eslint.org/docs/rules/global-require
  'global-require': 'error',

  // enforces error handling in callbacks (node environment)
  'handle-callback-err': 'off',

  // Allow console in Node.js
  'no-console': 'off',

  // disallow mixing regular variable and require declarations
  'no-mixed-requires': ['off', false],

  // disallow use of new operator with the require function
  'no-new-require': 'error',

  // disallow string concatenation with __dirname and __filename
  // http://eslint.org/docs/rules/no-path-concat
  'no-path-concat': 'error',

  // disallow use of process.env
  'no-process-env': 'off',

  // disallow process.exit()
  'no-process-exit': 'off',

  // restrict usage of specified node modules
  'no-restricted-modules': 'off',

  // disallow use of synchronous methods (off by default)
  'no-sync': 'off'
});


module.exports = config;
