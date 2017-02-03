'use strict';

const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const webpack = require('webpack');

const CWD = process.cwd();
const BUILD = path.join(CWD, 'build');
const PROJECT_MODULES = path.join(CWD, 'node_modules');
const BASE_MODULES = path.join(__dirname, '../node_modules');
const SRC = path.join(CWD, 'src');
const TEST = path.join(CWD, 'test');

const config = {
  context: CWD,
  entry: {
    index: [path.join(SRC, 'index.js')]
  },
  output: {
    path: BUILD,
    filename: '[name].bundle.js',
    chunkFilename: '[id].[chunkhash].js'
  },
  plugins: [],
  resolve: {
    modules: [PROJECT_MODULES, BASE_MODULES],
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [SRC],
        enforce: 'pre',
        use: require.resolve('eslint-loader')
      },
      {
        test: /\.js$/,
        include: [SRC, TEST],
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              [require.resolve('babel-preset-es2015'), { modules: false }]
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
          }
        }
      }
    ]
  }
};

const eslint = { configFile: path.join(__dirname, 'eslint.js'), emitError: true, failOnError: true };

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'eval';
  eslint.failOnError = false;
  eslint.emitWarning = false;
  eslint.emitError = false;
} else {
  // Copy all files except JS files, since they will be Babel-compiled to the output directory.
  // This only needs to be done in production since in development assets should be served from the
  // webpack-development-server via the source directory.
  config.plugins.push(
    new CopyPlugin([{ context: SRC, from: `**/*` }], { ignore: ['*.js*'] }),
    new ProgressBarPlugin(),
    new CleanPlugin([BUILD], { root: CWD })
  );

  config.output.filename = '[name].[chunkhash].bundle.js';
}

config.plugins.push(new webpack.LoaderOptionsPlugin({ options: { eslint }}));

module.exports = config;
