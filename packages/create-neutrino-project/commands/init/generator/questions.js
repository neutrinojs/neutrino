module.exports = () => [
  {
    name: 'project',
    type: 'list',
    message: 'Do you want to build an application, a library, or components?',
    choices: [
      {
        name: 'Application',
        value: 'application',
        checked: true
      },
      {
        name: 'Library',
        value: 'library',
        checked: false
      },
      {
        name: 'Components',
        value: 'components',
        checked: false
      },
    ],
    store: true
  },
  {
    name: 'projectType',
    type: 'list',
    message: 'What kind of application would you like to create?',
    when: (data) => data.project === 'application',
    choices: [
      {
        name: 'React',
        value: 'react',
        checked: true
      },
      {

        name: 'Web',
        value: 'web',
        checked: false
      },
      {
        name: 'Node.js',
        value: 'node',
        checked: false
      }
    ]
  },
  {
    name: 'projectType',
    type: 'list',
    message: 'What kind of library would you like to create?',
    when: (data) => data.project === 'library',
    choices: [{
      name: 'Web',
      value: 'taskcluster-web-library',
      checked: true
    }]
  },
  {
    name: 'projectType',
    type: 'list',
    message: 'What kind of components would you like to create?',
    when: (data) => data.project === 'components',
    choices: [
      {
        name: 'React Component',
        value: 'react-components',
        checked: true
      },
    ]
  },
  {
    name: 'router',
    type: 'confirm',
    message: 'Would you like to use React Router? If so, I will automatically code-split your routes for you.',
    when: (data) => data.projectType === 'react'
  },
  {
    name: 'testRunner',
    type: 'list',
    message: 'Would you like to add a test runner to your project?',
    choices: [
      {
        name: 'Jest',
        value: 'jest',
        checked: true
      },
      {
        name: 'Karma',
        value: 'karma',
        checked: false
      },
      {
        name: 'Mocha',
        value: 'mocha',
        checked: false
      },
      {
        name: 'none',
        value: false,
        checked: false
      },
    ],
    store: true
  },
  {
    name: 'linter',
    type: 'list',
    message: 'Would you like to add linting to your project?',
    choices: [
      {
        name: 'Airbnb style rules',
        value: 'airbnb',
        checked: true
      },
      {
        name: 'StandardJS rules',
        value: 'standardjs',
        checked: false
      },
      {
        name: 'none',
        value: false,
        checked: false
      }
    ],
    store: true
  }
];
