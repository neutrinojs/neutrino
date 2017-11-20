const projects = {
  '@neutrinojs/airbnb': {
    devDependencies: [
      '@neutrinojs/airbnb'
    ]
  },
  '@neutrinojs/airbnb-base': {
    devDependencies: [
      '@neutrinojs/airbnb-base'
    ]
  },
  '@neutrinojs/library': {
    devDependencies: [
      '@neutrinojs/library'
    ]
  },
  '@neutrinojs/node': {
    devDependencies: [
      '@neutrinojs/node'
    ]
  },
  '@neutrinojs/preact': {
    dependencies: [
      'preact',
      'preact-compat'
    ],
    devDependencies: [
      '@neutrinojs/preact'
    ]
  },
  '@neutrinojs/react': {
    dependencies: [
      'react',
      'react-dom',
      'react-hot-loader'
    ],
    devDependencies: [
      '@neutrinojs/react'
    ]
  },
  '@neutrinojs/react-components': {
    devDependencies: [
      '@neutrinojs/react',
      'react',
      'react-dom',
      'react-addons-css-transition-group'
    ]
  },
  '@neutrinojs/standardjs': {
    devDependencies: [
      '@neutrinojs/standardjs'
    ]
  },
  '@neutrinojs/vue': {
    dependencies: [
      'vue'
    ],
    devDependencies: [
      '@neutrinojs/vue'
    ]
  },
  '@neutrinojs/web': {
    devDependencies: [
      '@neutrinojs/web'
    ]
  }
};

const isYarn = process.env.npm_config_user_agent && process.env.npm_config_user_agent.includes('yarn');

module.exports = {
  projects,
  isYarn
};
