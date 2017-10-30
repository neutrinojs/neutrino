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
        value: 'neutrino-preset-react',
        checked: true
      },
      {

        name: 'Web',
        value: 'neutrino-preset-web',
        checked: false
      },
      {
        name: 'Node.js',
        value: 'neutrino-preset-node',
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
      value: 'neutrino-preset-taskcluster-web-library',
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
        value: 'neutrino-preset-react-components',
        checked: true
      },
    ]
  },
  {
    name: 'testRunner',
    type: 'list',
    message: 'Would you like to add a test runner to your project?',
    choices: [
      {
        name: 'Jest',
        value: 'neutrino-preset-jest',
        checked: true
      },
      {
        name: 'Karma',
        value: 'neutrino-preset-karma',
        checked: false
      },
      {
        name: 'Mocha',
        value: 'neutrino-preset-mocha',
        checked: false
      },
      {
        name: 'None',
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
        name: 'None',
        value: false,
        checked: false
      }
    ],
    store: true
  }
];
