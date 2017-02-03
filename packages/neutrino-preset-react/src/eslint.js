'use strict';

module.exports = {
  plugins: ['react'],
  extends: [
    require.resolve('neutrino-preset-web/src/eslint'),
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
};
