const projects = {
  '@neutrinojs/airbnb': {
    type: 'linting',
    devDependencies: [
      '@neutrinojs/airbnb'
    ]
  },
  '@neutrinojs/airbnb-base': {
    type: 'linting',
    devDependencies: [
      '@neutrinojs/airbnb-base'
    ]
  },
  '@neutrinojs/library': {
    type: 'project',
    devDependencies: [
      '@neutrinojs/library'
    ]
  },
  '@neutrinojs/node': {
    type: 'project',
    devDependencies: [
      '@neutrinojs/node'
    ]
  },
  '@neutrinojs/preact': {
    type: 'project',
    dependencies: [
      'preact',
      'preact-compat'
    ],
    devDependencies: [
      '@neutrinojs/preact'
    ]
  },
  '@neutrinojs/react': {
    type: 'project',
    dependencies: [
      'prop-types',
      'react',
      'react-dom',
      'react-hot-loader'
    ],
    devDependencies: [
      '@neutrinojs/react'
    ]
  },
  '@neutrinojs/react-components': {
    type: 'project',
    devDependencies: [
      '@neutrinojs/react-components',
      'react',
      'react-dom',
      'prop-types',
      'react-addons-css-transition-group'
    ]
  },
  '@neutrinojs/standardjs': {
    type: 'linting',
    devDependencies: [
      '@neutrinojs/standardjs'
    ]
  },
  '@neutrinojs/vue': {
    type: 'project',
    dependencies: [
      'vue'
    ],
    devDependencies: [
      '@neutrinojs/vue'
    ]
  },
  '@neutrinojs/web': {
    type: 'project',
    devDependencies: [
      '@neutrinojs/web'
    ]
  },
  '@neutrinojs/jest': {
    type: 'testing',
    devDependencies: [
      '@neutrinojs/jest'
    ]
  },
  '@neutrinojs/karma': {
    type: 'testing',
    devDependencies: [
      '@neutrinojs/karma'
    ]
  },
  '@neutrinojs/mocha': {
    type: 'testing',
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
