'use strict';

const base = require('neutrino-preset-base');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');
const merge = require('deepmerge');

const CWD = process.cwd();
const SRC = path.join(CWD, 'src');
const TEST = path.join(CWD, 'test');
const MODULES = path.join(__dirname, '../node_modules');

module.exports = neutrino => {
  return neutrino.extend(base, config => {
    config
      .target('node')
      .devtool('source-map')
      .externals([nodeExternals()])
      .node
        .set('__filename', false)
        .set('__dirname', false)
        .end()
      .output
        .filename('[name].js')
        .libraryTarget('commonjs2');

    config.resolve.modules.add(MODULES);
    config.resolveLoader.modules.add(MODULES);

    config
      .plugin('banner')
      .use(webpack.BannerPlugin, {
        banner: `require(${require.resolve('source-map-support')}).install();`,
        raw: true,
        entryOnly: true
      });

    config.options.set('performance', {
      hints: false
    });

    config
      .module
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

    return config;
  });
};
