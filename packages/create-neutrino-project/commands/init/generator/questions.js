const path = require('path');

module.exports = (defaults) => [
  {
    name: 'project',
    type: 'list',
    message: 'Do you want to build an application, a library, or components?',
    choices: [
      { name: 'Application',
        value: 'application',
        checked: true
      },
      { name: 'Library',
        value: 'library',
        checked: false
      },
      { name: 'Components',
        value: 'components',
        checked: false
      },
    ],
    store: true
  },
  {
    name: 'projectType',
    type: 'list',
    message: 'What kind of application?',
    when: (data) => data.project === 'application',
    choices: [
      { name: 'React',
        value: 'react',
        checked: true
      },
      {
        name: 'Web',
        value: 'web',
        checked: false
      },
      { name: 'Node',
        value: 'node',
        checked: false
      }
    ]
  },
  {
    name: 'projectType',
    type: 'list',
    message: 'What kind of library?',
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
    message: 'What kind of components?',
    when: (data) => data.project === 'components',
    choices: [
      {
        name: 'React Component',
        value: 'react-components',
        checked: false
      },
    ]
  },
  {
    name: 'router',
    type: 'confirm',
    message: 'Do you want to build a single-page application? I can set up code-splitting for you.',
    when: (data) => data.projectType === 'react'
  },
  {
    name: 'testRunner',
    type: 'list',
    message: 'What kind of test runner do you want?',
    choices: [
      { name: 'Jest',
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
      { name: 'none',
        value: false,
        checked: false
      },
    ],
    store: true
  },
  {
    name: 'linter',
    type: 'list',
    message: 'What kind of linter do you want?',
    choices: [
      { name: 'Airbnb style rules',
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
  },
  {
    name: 'name',
    message: 'What is the name of your package (i.e. npm package name)?',
    default: path.basename(process.cwd()).replace(/\s/g, '-'),
    store: false
  },
  {
    name: 'author',
    message: 'Who is the author of this app?',
    default: defaults.author,
    store: true
  },
  {
    name: 'description',
    message: 'Description',
    default: defaults.description
  }
];
