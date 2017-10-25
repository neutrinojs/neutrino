const deepmerge = require('deepmerge');
const mkdirp = require('mkdirp');
const path = require('path');
const changeCase = require('change-case');
const utils = require('./utils');

const VERSIONS = utils.VERSIONS;
const PROJECTS = utils.PROJECTS;
const LINTERS = utils.LINTERS;

function makeRcFile(data) {
  let config = { use: [] };

  if (data.projectType === PROJECTS.REACT) {
    config.use.push('neutrino-preset-react');
  } else {
    config.use.push(`neutrino-preset-${data.projectType}`);
  }

  if (data.testRunner) {
    config.use.push(`neutrino-preset-${data.testRunner}`);
  }

  switch (data.linter) {
    case LINTERS.AIRBNB:
      config.use.push(`neutrino-preset-${data.linter}${data.projectType === PROJECTS.WEB ? '-base' : ''}`);
      break;
    case LINTERS.STANDARDJS:
      config.use.push(`neutrino-middleware-${LINTERS.STANDARDJS}`);
      break;
    default:
      config.use.push(`neutrino-preset-${data.linter}`);
  }

  return `module.exports = ${JSON.stringify(config, null, 2)};\n`;
}

function requiredPackageJson(data) {
  const devDependencies = {};
  const dependencies = {};
  const scripts = {};

  switch (data.projectType) {
    case PROJECTS.REACT:
      dependencies[PROJECTS.REACT] = VERSIONS.REACT;
      dependencies['react-dom'] = VERSIONS.REACT;
      dependencies['react-hot-loader'] = VERSIONS.REACT_HOT_LOADER;
      devDependencies['neutrino-preset-react'] = VERSIONS.NEUTRINO;
      break;
    case PROJECTS.REACT_COMPONENTS:
      dependencies[PROJECTS.REACT] = VERSIONS.REACT;
      dependencies['react-dom'] = VERSIONS.REACT;
      dependencies['neutrino-preset-react-components'] = VERSIONS.REACT_COMPONENTS;
      dependencies['react-addons-css-transition-group'] = VERSIONS.REACT_ADDONS_CSS_TRANSITION_GROUP;
      break;
    case PROJECTS.WEB:
      devDependencies[`neutrino-preset-web`] = VERSIONS.NEUTRINO;
      break;
    case PROJECTS.NODE:
      devDependencies[`neutrino-preset-node`] = VERSIONS.NEUTRINO;
      break;
    case PROJECTS.WEB_LIBRARY:
      dependencies[`neutrino-preset-taskcluster-web-library`] = VERSIONS.WEB_LIBRARY;
      break;
  }

  if (data.testRunner) {
    devDependencies[`neutrino-preset-${data.testRunner}`] = VERSIONS.NEUTRINO;

    if (data.testRunner === 'karma' || data.testRunner === 'mocha') {
      devDependencies[`assert`] = VERSIONS.ASSERT;
    }

    scripts.test = 'neutrino test';
  }

  if (data.projectType === PROJECTS.REACT && data.router) {
    dependencies['react-router-dom'] = VERSIONS.REACT_ROUTER_DOM;
    dependencies['react-async-component'] = VERSIONS.REACT_ASYNC;
  }

  if (data.linter) {
    if (data.projectType === PROJECTS.WEB && data.linter === LINTERS.AIRBNB) {
      devDependencies[`neutrino-preset-airbnb-base`] = VERSIONS.NEUTRINO;
    } else if (data.linter === 'standardjs') {
      devDependencies[`neutrino-middleware-standardjs`] = VERSIONS.STANDARDJS;
    } else {
      devDependencies[`neutrino-preset-${data.linter}`] = VERSIONS[changeCase.upper(data.linter)];
    }

    scripts.lint = 'neutrino lint';
  }

  if (data.project !== 'library') {
    scripts.start = 'neutrino start';
  }

  devDependencies['neutrino'] = VERSIONS.NEUTRINO;

  return Object.assign(
    {},
    !utils.isObjectEmpty(devDependencies) ? { devDependencies } : null,
    !utils.isObjectEmpty(dependencies) ? { dependencies } : null,
    !utils.isObjectEmpty(scripts) ? { scripts } : null
  );
}

function makePackageJson(data) {
  let packageJson = {
    name: data.name,
    author: data.author,
    version: '1.0.0',
    description: data.description,
    engines: {
      'node': '>=6.10'
    },
    keywords: [
      'neutrino',
      data.projectType,
      'starter',
      'webpack'
    ],
    scripts: {
      'build': 'neutrino build'
    }
  };

  packageJson = deepmerge(packageJson, requiredPackageJson(data));

  return JSON.stringify(packageJson, null, 2);
}

module.exports = function () {
  let templateDir = this.data.projectType;

  if (this.data.router === 'react-router') {
    templateDir = 'react-router';
  }

  this.fs.copy(this.templatePath(`${templateDir}/src/**/*`), this.destinationPath('src'));
  this.fs.write(this.destinationPath('package.json'), makePackageJson(this.data));
  this.fs.write(this.destinationPath('.neutrinorc.js'), makeRcFile(this.data));

  if (this.data.testRunner) {
    const testDestinationDir = path.join(this.destinationRoot(), 'test');

    mkdirp.sync(testDestinationDir);
    this.fs.copy(
      this.templatePath(path.join('test', `${this.data.testRunner}.js`)),
      path.join(testDestinationDir, 'simple_test.js')
    );

    this.fs.copy(
      this.templatePath(path.join('test', `eslintrc.js`)),
      path.join(this.destinationRoot(), '.eslintrc.js')
    );
  }
};
