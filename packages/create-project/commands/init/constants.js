const { version: neutrinoVersion } = require('../../package.json');

const NONE = { name: 'None', value: false };
const APPLICATION = {
  name: 'A web or Node.js application',
  value: 'application',
};
const LIBRARY = { name: 'A library', value: 'library' };
const COMPONENTS = { name: 'Components', value: 'components' };
const LINTING = 'linting';
const PROJECT = 'project';
const TESTING = 'testing';

const presets = new Map();

// Neutrino packages
const N = {
  AIRBNB: '@neutrinojs/airbnb',
  AIRBNB_BASE: '@neutrinojs/airbnb-base',
  JEST: '@neutrinojs/jest',
  KARMA: '@neutrinojs/karma',
  NEUTRINO: 'neutrino',
  NODE: '@neutrinojs/node',
  PREACT: '@neutrinojs/preact',
  MOCHA: '@neutrinojs/mocha',
  REACT: '@neutrinojs/react',
  REACT_COMPONENTS: '@neutrinojs/react-components',
  STANDARDJS: '@neutrinojs/standardjs',
  VUE: '@neutrinojs/vue',
  WEB: '@neutrinojs/web',
  WEB_NODE_LIBRARY: '@neutrinojs/library',
};

// Tool dependencies
const ESLINT = 'eslint@^7';
const JEST = 'jest@^26';
const KARMA = 'karma@^5';
const KARMA_CLI = 'karma-cli@^2';
const MOCHA = 'mocha@^8';
const PREACT = 'preact@^10';
const PROP_TYPES_VERSION = '^15';
const PROP_TYPES = `prop-types@${PROP_TYPES_VERSION}`;
const REACT_VERSION = '^16';
const REACT = `react@${REACT_VERSION}`;
const REACT_DOM_VERSION = '^16';
const REACT_DOM = `react-dom@${REACT_DOM_VERSION}`;
const REACT_HOT_LOADER = 'react-hot-loader@^4';
const VUE = 'vue@^2';
const WEBPACK = 'webpack@^4';
const WEBPACK_CLI = 'webpack-cli@^3';
const WEBPACK_DEV_SERVER = 'webpack-dev-server@^3';

// package.json necessities
const ENTRIES = { main: 'build/index.js', module: 'src/index.js' };
const DEV_SERVER_START = 'webpack-dev-server --mode development --open';
const WATCH_START = 'webpack --watch --mode development';
const BUILD = 'webpack --mode production';

// For dependencies that are Neutrino monorepo packages, install the
// same major version as found in create-project's package.json.
const version = (dependency) => `${dependency}@^${neutrinoVersion}`;
const webapp = (name) => ({
  html: {
    title: name,
  },
});

[
  {
    name: 'airbnb',
    description: 'Airbnb style rules',
    type: LINTING,
    package: N.AIRBNB,
    packageJson: {
      devDependencies: [version(N.AIRBNB), ESLINT],
    },
  },
  {
    name: 'airbnbBase',
    description: 'Airbnb style rules',
    type: LINTING,
    package: N.AIRBNB_BASE,
    packageJson: {
      devDependencies: [version(N.AIRBNB_BASE), ESLINT],
    },
  },
  {
    name: 'library',
    description: 'Web and/or Node.js',
    type: PROJECT,
    projectType: LIBRARY.value,
    package: N.WEB_NODE_LIBRARY,
    packageJson: {
      ...ENTRIES,
      devDependencies: [
        version(N.WEB_NODE_LIBRARY),
        version(N.NEUTRINO),
        WEBPACK,
        WEBPACK_CLI,
      ],
      scripts: {
        build: BUILD,
      },
    },
    options: (name) => ({ name }),
  },
  {
    name: 'node',
    description: 'Node.js',
    type: PROJECT,
    projectType: APPLICATION.value,
    package: N.NODE,
    packageJson: {
      ...ENTRIES,
      devDependencies: [
        version(N.NODE),
        version(N.NEUTRINO),
        WEBPACK,
        WEBPACK_CLI,
      ],
      scripts: {
        start: WATCH_START,
        build: BUILD,
      },
    },
  },
  {
    name: 'preact',
    description: 'Preact',
    type: PROJECT,
    projectType: APPLICATION.value,
    package: N.PREACT,
    packageJson: {
      dependencies: [PREACT],
      devDependencies: [
        version(N.PREACT),
        version(N.NEUTRINO),
        WEBPACK,
        WEBPACK_CLI,
        WEBPACK_DEV_SERVER,
      ],
      scripts: {
        start: DEV_SERVER_START,
        build: BUILD,
      },
    },
    options: webapp,
  },
  {
    name: 'react',
    description: 'React',
    type: PROJECT,
    projectType: APPLICATION.value,
    package: N.REACT,
    packageJson: {
      dependencies: [PROP_TYPES, REACT, REACT_DOM, REACT_HOT_LOADER],
      devDependencies: [
        version(N.REACT),
        version(N.NEUTRINO),
        WEBPACK,
        WEBPACK_CLI,
        WEBPACK_DEV_SERVER,
      ],
      scripts: {
        start: DEV_SERVER_START,
        build: BUILD,
      },
    },
    options: webapp,
  },
  {
    name: 'reactComponents',
    description: 'React Components',
    type: PROJECT,
    projectType: COMPONENTS.value,
    package: N.REACT_COMPONENTS,
    packageJson: {
      devDependencies: [
        version(N.REACT_COMPONENTS),
        version(N.NEUTRINO),
        PROP_TYPES,
        REACT,
        REACT_DOM,
        WEBPACK,
        WEBPACK_CLI,
        WEBPACK_DEV_SERVER,
      ],
      // peerDependencies are copied directly to package.json so must be an object,
      // unlike dependencies and devDependencies which are passed to npm/yarn instead.
      peerDependencies: {
        'prop-types': PROP_TYPES_VERSION,
        react: REACT_VERSION,
        'react-dom': REACT_DOM_VERSION,
      },
      scripts: {
        start: DEV_SERVER_START,
        build: BUILD,
      },
    },
  },
  {
    name: 'standard',
    description: 'StandardJS rules',
    type: LINTING,
    package: N.STANDARDJS,
    packageJson: {
      devDependencies: [version(N.STANDARDJS), ESLINT],
    },
  },
  {
    name: 'vue',
    description: 'Vue',
    type: PROJECT,
    projectType: APPLICATION.value,
    package: N.VUE,
    packageJson: {
      dependencies: [VUE],
      devDependencies: [
        version(N.VUE),
        version(N.NEUTRINO),
        WEBPACK,
        WEBPACK_CLI,
        WEBPACK_DEV_SERVER,
      ],
      scripts: {
        start: DEV_SERVER_START,
        build: BUILD,
      },
    },
    options: webapp,
  },
  {
    name: 'web',
    description: 'Some other web app, e.g. Angular, jQuery, or plain JS',
    type: PROJECT,
    projectType: APPLICATION.value,
    package: N.WEB,
    packageJson: {
      devDependencies: [
        version(N.WEB),
        version(N.NEUTRINO),
        WEBPACK,
        WEBPACK_CLI,
        WEBPACK_DEV_SERVER,
      ],
      scripts: {
        start: DEV_SERVER_START,
        build: BUILD,
      },
    },
    options: webapp,
  },
  {
    name: 'jest',
    description: 'Jest',
    type: TESTING,
    package: N.JEST,
    packageJson: {
      devDependencies: [version(N.JEST), JEST],
      scripts: {
        test: 'jest',
      },
    },
  },
  {
    name: 'karma',
    description: 'Karma',
    type: TESTING,
    package: N.KARMA,
    packageJson: {
      devDependencies: [version(N.KARMA), KARMA, KARMA_CLI, MOCHA],
      scripts: {
        test: 'karma start --single-run',
      },
    },
  },
  {
    name: 'mocha',
    description: 'Mocha',
    type: TESTING,
    package: N.MOCHA,
    packageJson: {
      devDependencies: [version(N.MOCHA), MOCHA],
      scripts: {
        test: 'mocha',
      },
    },
  },
].forEach((preset) => {
  presets.set(preset.package, preset);
  presets.set(preset.name, preset);
});

// Question utilities
const toChoice = (pkg) => {
  const value = presets.get(pkg);

  return { name: value.description, value: pkg };
};

// Questions
const questions = [
  {
    name: 'projectType',
    type: 'list',
    message: '🤔  First up, what would you like to create?',
    choices: [APPLICATION, LIBRARY, COMPONENTS],
  },
  {
    name: 'project',
    type: 'list',
    message: '🤔  Next, what kind of application would you like to create?',
    when: (data) => data.projectType === APPLICATION.value,
    choices: [N.REACT, N.PREACT, N.VUE, N.NODE, N.WEB].map(toChoice),
  },
  {
    name: 'project',
    type: 'list',
    message: '🤔  Next, what kind of library would you like to create?',
    when: (data) => data.projectType === LIBRARY.value,
    choices: [N.WEB_NODE_LIBRARY].map(toChoice),
  },
  {
    name: 'project',
    type: 'list',
    message: '🤔  Next, what kind of components would you like to create?',
    when: (data) => data.projectType === COMPONENTS.value,
    choices: [N.REACT_COMPONENTS].map(toChoice),
  },
  {
    name: 'testRunner',
    type: 'list',
    message: '🤔  Would you like to add a test runner to your project?',
    when: (data) => !data.project.includes('node'),
    choices: [N.JEST, N.KARMA, N.MOCHA].map(toChoice).concat(NONE),
  },
  {
    name: 'testRunner',
    type: 'list',
    message: '🤔  Would you like to add a test runner to your project?',
    when: (data) => data.project.includes('node'),
    choices: [N.JEST, N.MOCHA].map(toChoice).concat(NONE),
  },
  {
    name: 'linter',
    type: 'list',
    message: '🤔  Would you like to add linting to your project?',
    when: (data) => data.project.includes('react'),
    choices: [N.AIRBNB, N.STANDARDJS].map(toChoice).concat(NONE),
  },
  {
    name: 'linter',
    type: 'list',
    message: '🤔  Would you like to add linting to your project?',
    when: (data) => !data.project.includes('react'),
    choices: [N.AIRBNB_BASE, N.STANDARDJS].map(toChoice).concat(NONE),
  },
];

module.exports = {
  presets,
  questions,
  N,
  APPLICATION: APPLICATION.value,
  LIBRARY: LIBRARY.value,
  COMPONENTS: COMPONENTS.value,
  NONE,
  LOGO: `                        _          _
    _ __    ___  _   _ | |_  _ __ (_) _ __    ___
   | '_ \\  / _ \\| | | || __|| '__|| || '_ \\  / _ \\
   | | | ||  __/| |_| || |_ | |   | || | | || (_) |
   |_| |_| \\___| \\__,_| \\__||_|   |_||_| |_| \\___/
  `,
};
