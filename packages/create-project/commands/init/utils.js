const LINTING = 'linting';
const PROJECT = 'project';
const TESTING = 'testing';

const projects = {
  '@neutrinojs/airbnb': {
    type: LINTING,
    devDependencies: [
      '@neutrinojs/airbnb'
    ]
  },
  '@neutrinojs/airbnb-base': {
    type: LINTING,
    devDependencies: [
      '@neutrinojs/airbnb-base'
    ]
  },
  '@neutrinojs/library': {
    type: PROJECT,
    devDependencies: [
      '@neutrinojs/library',
      'neutrino'
    ]
  },
  '@neutrinojs/node': {
    type: PROJECT,
    devDependencies: [
      '@neutrinojs/node',
      'neutrino'
    ]
  },
  '@neutrinojs/preact': {
    type: PROJECT,
    dependencies: [
      'preact',
      'preact-compat'
    ],
    devDependencies: [
      '@neutrinojs/preact',
      'neutrino'
    ]
  },
  '@neutrinojs/react': {
    type: PROJECT,
    dependencies: [
      'prop-types',
      'react',
      'react-dom',
      'react-hot-loader'
    ],
    devDependencies: [
      '@neutrinojs/react',
      'neutrino'
    ]
  },
  '@neutrinojs/react-components': {
    type: PROJECT,
    devDependencies: [
      '@neutrinojs/react-components',
      'neutrino',
      'react',
      'react-dom',
      'prop-types',
      'react-addons-css-transition-group'
    ]
  },
  '@neutrinojs/standardjs': {
    type: LINTING,
    devDependencies: [
      '@neutrinojs/standardjs'
    ]
  },
  '@neutrinojs/vue': {
    type: PROJECT,
    dependencies: [
      'vue'
    ],
    devDependencies: [
      '@neutrinojs/vue',
      'neutrino'
    ]
  },
  '@neutrinojs/web': {
    type: PROJECT,
    devDependencies: [
      '@neutrinojs/web',
      'neutrino'
    ]
  },
  '@neutrinojs/jest': {
    type: TESTING,
    devDependencies: [
      '@neutrinojs/jest'
    ]
  },
  '@neutrinojs/karma': {
    type: TESTING,
    devDependencies: [
      '@neutrinojs/karma'
    ]
  },
  '@neutrinojs/mocha': {
    type: TESTING,
    devDependencies: [
      '@neutrinojs/mocha'
    ]
  }
};

const isYarn = process.env.npm_config_user_agent && process.env.npm_config_user_agent.includes('yarn');

module.exports = {
  projects,
  isYarn
};
