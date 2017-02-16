'use strict';

const path = require('path');

const MODULES = path.join(__dirname, '../node_modules');

module.exports = ({ config }) => {
  config
    .module
      .rule('lint')
        .test(/\.(js|jsx)$/)
        .pre()
        .include(path.join(process.cwd(), 'src'))
        .loader('eslint', require.resolve('eslint-loader'), {
          failOnError: process.env.NODE_ENV !== 'development',
          emitWarning: process.env.NODE_ENV !== 'development',
          emitError: process.env.NODE_ENV !== 'development',
          cwd: process.cwd(),
          useEslintrc: false,
          root: true,
          plugins: ['babel'],
          baseConfig: {
            extends: ['airbnb-base']
          },
          envs: ['es6'],
          parser: 'babel-eslint',
          parserOptions: {
            ecmaVersion: 2017,
            sourceType: 'module',
            ecmaFeatures: {
              objectLiteralDuplicateProperties: false,
              generators: true,
              impliedStrict: true
            }
          },
          settings: {},
          globals: ['process'],
          rules: {
            // handled by babel rules
            'new-cap': 'off',

            // handled by babel rules
            'object-curly-spacing': 'off',

            // require a capital letter for constructors
            'babel/new-cap': ['error', { newIsCap: true }],

            // require padding inside curly braces
            'babel/object-curly-spacing': ['error', 'always'],

            // guard against awaiting async functions inside of a loop
            'babel/no-await-in-loop': 'error'
          }
        });

  config.resolve.modules.add(MODULES);
  config.resolveLoader.modules.add(MODULES);
};
