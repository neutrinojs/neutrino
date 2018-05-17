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

const projects = {
  [AIRBNB]: {
    type: LINTING,
    devDependencies: [AIRBNB]
  },
  [AIRBNB_BASE]: {
    type: LINTING,
    devDependencies: [AIRBNB_BASE]
  },
  [WEB_NODE_LIBRARY]: {
    type: PROJECT,
    devDependencies: [WEB_NODE_LIBRARY, N]
  },
  [NODE]: {
    type: PROJECT,
    devDependencies: [NODE, N]
  },
  [PREACT]: {
    type: PROJECT,
    dependencies: ['preact', 'preact-compat'],
    devDependencies: [PREACT, N]
  },
  [REACT]: {
    type: PROJECT,
    dependencies: ['prop-types', 'react', 'react-dom', 'react-hot-loader'],
    devDependencies: [REACT, N]
  },
  [REACT_COMPONENTS]: {
    type: PROJECT,
    devDependencies: [REACT_COMPONENTS, N, 'prop-types', 'react', 'react-dom']
  },
  [STANDARDJS]: {
    type: LINTING,
    devDependencies: [STANDARDJS]
  },
  [VUE]: {
    type: PROJECT,
    dependencies: ['vue'],
    devDependencies: [VUE, N]
  },
  [WEB]: {
    type: PROJECT,
    devDependencies: [WEB, N]
  },
  [JEST]: {
    type: TESTING,
    devDependencies: [JEST]
  },
  [KARMA]: {
    type: TESTING,
    devDependencies: [KARMA]
  },
  [MOCHA]: {
    type: TESTING,
    devDependencies: [MOCHA]
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
