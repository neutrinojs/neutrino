module.exports = () => [
  {
    name: 'projectType',
    type: 'list',
    message: 'First up, what would you like to create?',
    choices: [
      {
        name: 'A web or Node.js application',
        value: 'application'
      },
      {
        name: 'A library',
        value: 'library'
      },
      {
        name: 'Components',
        value: 'components'
      }
    ],
    store: true
  },
  {
    name: 'project',
    type: 'list',
    message: 'Great! Next, what kind of application would you like to create?',
    when: data => data.projectType === 'application',
    choices: [
      {
        name: 'React',
        value: '@neutrinojs/react'
      },
      {
        name: 'Preact',
        value: '@neutrinojs/preact'
      },
      {
        name: 'Vue',
        value: '@neutrinojs/vue'
      },
      {
        name: 'Some other web app, e.g. Angular, jQuery, or plain JS',
        value: '@neutrinojs/web'
      },
      {
        name: 'Node.js',
        value: '@neutrinojs/node'
      }
    ]
  },
  {
    name: 'project',
    type: 'list',
    message: 'Great! Next, what kind of library would you like to create?',
    when: data => data.projectType === 'library',
    choices: [
      {
        name: 'Web and/or Node.js',
        value: '@neutrinojs/library'
      }
    ]
  },
  {
    name: 'project',
    type: 'list',
    message: 'Great! Next, what kind of components would you like to create?',
    when: data => data.projectType === 'components',
    choices: [
      {
        name: 'React Components',
        value: '@neutrinojs/react-components'
      }
    ]
  },
  {
    name: 'testRunner',
    type: 'list',
    message: 'Would you like to add a test runner to your project?',
    choices: [
      {
        name: 'Jest',
        value: '@neutrinojs/jest'
      },
      {
        name: 'Karma',
        value: '@neutrinojs/karma'
      },
      {
        name: 'Mocha',
        value: '@neutrinojs/mocha'
      },
      {
        name: 'None',
        value: false
      }
    ],
    store: true
  },
  {
    name: 'linter',
    type: 'list',
    message: 'Would you like to add linting to your project?',
    when: data => data.project.includes('react'),
    choices: [
      {
        name: 'Airbnb style rules',
        value: '@neutrinojs/airbnb'
      },
      {
        name: 'StandardJS rules',
        value: '@neutrinojs/standardjs'
      },
      {
        name: 'None',
        value: false
      }
    ],
    store: true
  },
  {
    name: 'linter',
    type: 'list',
    message: 'Would you like to add linting to your project?',
    when: data => !data.project.includes('react'),
    choices: [
      {
        name: 'Airbnb style rules',
        value: '@neutrinojs/airbnb-base'
      },
      {
        name: 'StandardJS rules',
        value: '@neutrinojs/standardjs'
      },
      {
        name: 'None',
        value: false
      }
    ],
    store: true
  }
];
