module.exports = () => [
  {
    name: 'projectType',
    type: 'list',
    message: 'First up, what would you like to create?',
    choices: [
      {
        name: 'A web or Node.js application',
        value: 'application',
        checked: true
      },
      {
        name: 'A library',
        value: 'library',
        checked: false
      },
      {
        name: 'Components',
        value: 'components',
        checked: false
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
        value: '@neutrinojs/react',
        checked: true
      },
      {
        name: 'Preact',
        value: '@neutrinojs/preact',
        checked: false
      },
      {

        name: 'Vue',
        value: '@neutrinojs/vue',
        checked: false
      },
      {

        name: 'Some other web app, e.g. Angular, jQuery, or plain JS',
        value: '@neutrinojs/web',
        checked: false
      },
      {
        name: 'Node.js',
        value: '@neutrinojs/node',
        checked: false
      }
    ]
  },
  {
    name: 'project',
    type: 'list',
    message: 'Great! Next, what kind of library would you like to create?',
    when: data => data.projectType === 'library',
    choices: [{
      name: 'Web and/or Node.js',
      value: '@neutrinojs/library',
      checked: true
    }]
  },
  {
    name: 'project',
    type: 'list',
    message: 'Great! Next, what kind of components would you like to create?',
    when: data => data.projectType === 'components',
    choices: [
      {
        name: 'React Components',
        value: '@neutrinojs/react-components',
        checked: true
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
        value: '@neutrinojs/jest',
        checked: true
      },
      {
        name: 'Karma',
        value: '@neutrinojs/karma',
        checked: false
      },
      {
        name: 'Mocha',
        value: '@neutrinojs/mocha',
        checked: false
      },
      {
        name: 'None',
        value: false,
        checked: false
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
        value: '@neutrinojs/airbnb',
        checked: true
      },
      {
        name: 'StandardJS rules',
        value: '@neutrinojs/standardjs',
        checked: false
      },
      {
        name: 'None',
        value: false,
        checked: false
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
        value: '@neutrinojs/airbnb-base',
        checked: true
      },
      {
        name: 'StandardJS rules',
        value: '@neutrinojs/standardjs',
        checked: false
      },
      {
        name: 'None',
        value: false,
        checked: false
      }
    ],
    store: true
  }
];
