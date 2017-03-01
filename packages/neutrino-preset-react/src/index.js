'use strict';

const merge = require('deepmerge');
const path = require('path');
const webpack = require('webpack');

const MODULES = path.join(__dirname, '../node_modules');

module.exports = neutrino => {
  neutrino.use(require('neutrino-preset-web'));

  const { config } = neutrino;

  if (config.module.rules.has('lint')) {
    config.module
      .rule('lint')
      .test(/\.jsx?$/)
      .loader('eslint', props => merge(props, {
        options: {
          plugins: ['react'],
          baseConfig: {
            extends: ['plugin:react/recommended']
          },
          parserOptions: {
            ecmaFeatures: {
              experimentalObjectRestSpread: true
            }
          },
          rules: {
            'react/prop-types': ['off'],
            'jsx-quotes': ['error', 'prefer-double'],
            'class-methods-use-this': ['error', {
              exceptMethods: [
                'render',
                'getInitialState',
                'getDefaultProps',
                'getChildContext',
                'componentWillMount',
                'componentDidMount',
                'componentWillReceiveProps',
                'shouldComponentUpdate',
                'componentWillUpdate',
                'componentDidUpdate',
                'componentWillUnmount'
              ]
            }]
          }
        }
      }));
  }

  config.module
    .rule('compile')
    .test(/\.jsx?$/)
    .loader('babel', props => merge(props, {
      options: {
        presets: [require.resolve('babel-preset-react')],
        plugins: [require.resolve('babel-plugin-transform-object-rest-spread')],
        env: {
          development: {
            plugins: [require.resolve('react-hot-loader/babel')]
          }
        }
      }
    }));

  config.resolve.modules.add(MODULES);
  config.resolve.extensions.add('.jsx');
  config.resolveLoader.modules.add(MODULES);

  config
    .externals({
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window'
    });

  if (process.env.NODE_ENV === 'development') {
    config
      .entry('index')
      .prepend(require.resolve('react-hot-loader/patch'));
  }
};
