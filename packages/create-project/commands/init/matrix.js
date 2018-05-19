const LINTING = 'linting';
const PROJECT = 'project';
const TESTING = 'testing';
const N = 'neutrino';
const REACT = '@neutrinojs/react';
const PREACT = '@neutrinojs/preact';
const VUE = '@neutrinojs/vue';
const WEB = '@neutrinojs/web';
const NODE = '@neutrinojs/node';
const WEB_NODE_LIBRARY = '@neutrinojs/library';
const REACT_COMPONENTS = '@neutrinojs/react-components';
const JEST = '@neutrinojs/jest';
const KARMA = '@neutrinojs/karma';
const MOCHA = '@neutrinojs/mocha';
const AIRBNB = '@neutrinojs/airbnb';
const AIRBNB_BASE = '@neutrinojs/airbnb-base';
const STANDARDJS = '@neutrinojs/standardjs';
const ESLINT = 'eslint';
const WEBPACK = 'webpack';
const WEBPACK_CLI = 'webpack-cli';
const WEBPACK_DEV_SERVER = 'webpack-dev-server';

const projects = {
  [AIRBNB]: {
    type: LINTING,
    devDependencies: [AIRBNB, ESLINT]
  },
  [AIRBNB_BASE]: {
    type: LINTING,
    devDependencies: [AIRBNB_BASE, ESLINT]
  },
  [WEB_NODE_LIBRARY]: {
    type: PROJECT,
    devDependencies: [
      WEB_NODE_LIBRARY,
      N,
      WEBPACK,
      WEBPACK_CLI,
      WEBPACK_DEV_SERVER
    ]
  },
  [NODE]: {
    type: PROJECT,
    devDependencies: [NODE, N, WEBPACK, WEBPACK_CLI]
  },
  [PREACT]: {
    type: PROJECT,
    dependencies: ['preact', 'preact-compat'],
    devDependencies: [PREACT, N, WEBPACK, WEBPACK_CLI, WEBPACK_DEV_SERVER]
  },
  [REACT]: {
    type: PROJECT,
    dependencies: ['prop-types', 'react', 'react-dom', 'react-hot-loader'],
    devDependencies: [REACT, N, WEBPACK, WEBPACK_CLI, WEBPACK_DEV_SERVER]
  },
  [REACT_COMPONENTS]: {
    type: PROJECT,
    devDependencies: [
      REACT_COMPONENTS,
      N,
      'prop-types',
      'react',
      'react-dom',
      WEBPACK, WEBPACK_CLI
    ]
  },
  [STANDARDJS]: {
    type: LINTING,
    devDependencies: [STANDARDJS, ESLINT]
  },
  [VUE]: {
    type: PROJECT,
    dependencies: ['vue'],
    devDependencies: [VUE, N, WEBPACK, WEBPACK_CLI, WEBPACK_DEV_SERVER]
  },
  [WEB]: {
    type: PROJECT,
    devDependencies: [WEB, N, WEBPACK, WEBPACK_CLI, WEBPACK_DEV_SERVER]
  },
  [JEST]: {
    type: TESTING,
    devDependencies: [JEST, 'jest']
  },
  [KARMA]: {
    type: TESTING,
    devDependencies: [
      KARMA,
      'karma',
      'karma-cli',
      'mocha'
    ]
  },
  [MOCHA]: {
    type: TESTING,
    devDependencies: [MOCHA, 'mocha']
  }
};

const packages = {
  NEUTRINO: N,
  REACT,
  PREACT,
  VUE,
  WEB,
  NODE,
  WEB_NODE_LIBRARY,
  REACT_COMPONENTS,
  JEST,
  KARMA,
  MOCHA,
  AIRBNB,
  AIRBNB_BASE,
  STANDARDJS
};

module.exports = { projects, packages };
