'use strict';

const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');
const merge = require('deepmerge');
const CopyPlugin = require('copy-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const CWD = process.cwd();
const SRC = path.join(CWD, 'src');
const BUILD = path.join(CWD, 'build');
const TEST = path.join(CWD, 'test');
const MODULES = path.join(__dirname, '../node_modules');

module.exports = neutrino => {
  const { config } = neutrino;

  config
    .target('node')
    .node
      .set('__filename', false)
      .set('__dirname', false)
      .end()
    .devtool('source-map')
    .externals([nodeExternals()])
    .context(CWD)
    .entry('index')
      .add(path.join(SRC, 'index.js'))
      .end()
    .output
      .path(BUILD)
      .filename('[name].js')
      .libraryTarget('commonjs2')
      .chunkFilename('[id].[chunkhash].js')
      .end()
    .resolve
      .modules
        .add(PROJECT_MODULES)
        .add(MODULES)
        .end()
      .extensions
        .add('.js')
        .add('json')
        .end()
      .end()
    .resolveLoader
      .modules
        .add(PROJECT_MODULES)
        .add(MODULES);

  config.options.set('performance', { hints: false });

  config
    .plugin('banner')
    .use(webpack.BannerPlugin, {
      banner: `require(${require.resolve('source-map-support')}).install();`,
      raw: true,
      entryOnly: true
    });

  if (config.module.rules.has('lint')) {
    config.module
      .rule('lint')
      .loader('eslint', ({ options }) => {
        return {
          options: merge(options, {
            envs: ['node'],
            rules: {
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
            }
          })
        };
      });
  }

  config.module
    .rule('compile')
      .test(/\.js$/)
      .include(SRC, TEST)
      .loader('babel', require.resolve('babel-loader'), {
        presets: [
          [
            require.resolve('babel-preset-env'),
            {
              modules: false,
              include: 'transform-regenerator',
              targets: {
                node: 6.9
              }
            }
          ]
        ]
      });

  if (process.env.NODE_ENV !== 'development') {
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
};
