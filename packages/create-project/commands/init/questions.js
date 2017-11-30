const NONE = { name: 'None', value: false };
const APPLICATION = { name: 'A web or Node.js application', value: 'application' };
const LIBRARY = { name: 'A library', value: 'library' };
const COMPONENTS = { name: 'Components', value: 'components' };
const REACT = { name: 'React', value: '@neutrinojs/react' };
const PREACT = { name: 'Preact', value: '@neutrinojs/preact' };
const VUE = { name: 'Vue', value: '@neutrinojs/vue' };
const WEB = { name: 'Some other web app, e.g. Angular, jQuery, or plain JS', value: '@neutrinojs/web' };
const NODE = { name: 'Node.js', value: '@neutrinojs/node' };
const WEB_NODE_LIBRARY = { name: 'Web and/or Node.js', value: '@neutrinojs/library' };
const REACT_COMPONENTS = { name: 'React Components', value: '@neutrinojs/react-components' };
const JEST = { name: 'Jest', value: '@neutrinojs/jest' };
const KARMA = { name: 'Karma', value: '@neutrinojs/karma' };
const MOCHA = { name: 'Mocha', value: '@neutrinojs/mocha' };
const AIRBNB = { name: 'Airbnb style rules', value: '@neutrinojs/airbnb' };
const AIRBNB_BASE = { name: 'Airbnb style rules', value: '@neutrinojs/airbnb-base' };
const STANDARDJS = { name: 'StandardJS rules', value: '@neutrinojs/standardjs' };

module.exports = () => [
  {
    name: 'projectType',
    type: 'list',
    message: '🤔  First up, what would you like to create?',
    choices: [APPLICATION, LIBRARY, COMPONENTS]
  },
  {
    name: 'project',
    type: 'list',
    message: '🤔  Next, what kind of application would you like to create?',
    when: data => data.projectType === 'application',
    choices: [REACT, PREACT, VUE, NODE, WEB]
  },
  {
    name: 'project',
    type: 'list',
    message: '🤔  Next, what kind of library would you like to create?',
    when: data => data.projectType === 'library',
    choices: [WEB_NODE_LIBRARY]
  },
  {
    name: 'project',
    type: 'list',
    message: '🤔  Next, what kind of components would you like to create?',
    when: data => data.projectType === 'components',
    choices: [REACT_COMPONENTS]
  },
  {
    name: 'testRunner',
    type: 'list',
    message: '🤔  Would you like to add a test runner to your project?',
    when: data => !data.project.includes('node'),
    choices: [JEST, KARMA, MOCHA, NONE]
  },
  {
    name: 'testRunner',
    type: 'list',
    message: '🤔  Would you like to add a test runner to your project?',
    when: data => data.project.includes('node'),
    choices: [JEST, MOCHA, NONE]
  },
  {
    name: 'linter',
    type: 'list',
    message: '🤔  Would you like to add linting to your project?',
    when: data => data.project.includes('react'),
    choices: [AIRBNB, STANDARDJS, NONE]
  },
  {
    name: 'linter',
    type: 'list',
    message: '🤔  Would you like to add linting to your project?',
    when: data => !data.project.includes('react'),
    choices: [AIRBNB_BASE, STANDARDJS, NONE]
  }
];
