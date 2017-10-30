const { ensureDirSync, readJsonSync, writeJsonSync } = require('fs-extra');
const path = require('path');
const stringify = require('javascript-stringify');
const utils = require('./utils');

const PROJECTS = utils.PROJECTS;
const LIBRARY = utils.LIBRARY;
const LINTERS = utils.LINTERS;

function makeRcFile(data) {
  let config = { use: [] };

  config.use.push(data.projectType);

  switch (data.linter) {
    case LINTERS.AIRBNB:
      config.use.push(
        data.projectType === PROJECTS.WEB ? LIBRARY.NEUTRINO_PRESET_AIRBNB_BASE : LIBRARY.NEUTRINO_PRESET_AIRBNB
      );
      break;
    case LINTERS.STANDARDJS:
      config.use.push(LIBRARY.NEUTRINO_MIDDLEWARE_STANDARDJS);
      break;
    default:
      break;
  }

  if (data.testRunner) {
    config.use.push(data.testRunner);
  }

  return `module.exports = ${stringify(config, null, 2)};\n`;
}

function getDependencies() {
  const devDependencies = [];
  const dependencies = [];

  switch (this.data.projectType) {
    case PROJECTS.REACT:
      dependencies.push(LIBRARY.REACT, LIBRARY.REACT_DOM, LIBRARY.REACT_HOT_LOADER);
      devDependencies.push(LIBRARY.NEUTRINO_PRESET_REACT);
      break;
    case PROJECTS.REACT_COMPONENTS:
      dependencies.push(
        LIBRARY.REACT,
        LIBRARY.REACT_DOM,
        LIBRARY.NEUTRINO_PRESET_REACT_COMPONENTS,
        LIBRARY.REACT_ADDONS_CSS_TRANSITION_GROUP
      );
      break;
    case PROJECTS.WEB:
      devDependencies.push(LIBRARY.NEUTRINO_PRESET_WEB);
      break;
    case PROJECTS.NODE:
      devDependencies.push(LIBRARY.NEUTRINO_PRESET_NODE);
      break;
    case PROJECTS.WEB_LIBRARY:
      dependencies.push(LIBRARY.NEUTRINO_PRESET_TASKCLUSTER_WEB_LIBRARY);
      break;
  }

  if (this.data.testRunner) {
    devDependencies.push(this.data.testRunner);
  }

  if (this.data.linter) {
    if (this.data.projectType === PROJECTS.WEB && this.data.linter === LINTERS.AIRBNB) {
      devDependencies.push(LIBRARY.NEUTRINO_PRESET_AIRBNB_BASE);
    } else if (this.data.linter === LINTERS.STANDARDJS) {
      devDependencies.push(LIBRARY.NEUTRINO_MIDDLEWARE_STANDARDJS);
    } else {
      devDependencies.push(LIBRARY.NEUTRINO_PRESET_AIRBNB);
    }
  }

  devDependencies.push(LIBRARY.NEUTRINO);

  return Object.assign(
    {},
    !utils.isObjectEmpty(dependencies) ? { dependencies } : null,
    !utils.isObjectEmpty(devDependencies) ? { devDependencies } : null
  );
}

function initialPackageJson() {
  const done = this.async();
  const installer = utils.isYarn ? 'yarn' : 'npm';
  const scripts = { 'build': 'neutrino build' };

  if (this.data.project !== 'library') {
    scripts.start = 'neutrino start';
  }

  if (this.data.project === 'linter') {
    scripts.lint = 'neutrino lint';
  }

  if (this.data.testRunner) {
    scripts.test = 'neutrino test';
  }

  ensureDirSync(this.options.directory);

  const command = this.spawnCommand(installer, ['init', '--yes'], { cwd: path.resolve(this.options.directory), stdio: 'ignore'});

  command.on('close', () => {
    const jsonPath = path.join(this.options.directory, 'package.json');
    const json = readJsonSync(`./${jsonPath}`);
    const packageJson = Object.assign(json, { scripts });

    writeJsonSync(jsonPath, packageJson, { spaces: 2 });

    return done();
  });
}

module.exports = function () {
  const destinationPath =  this.destinationPath(this.options.directory);
  const templateDir = this.data.projectType;

  initialPackageJson.call(this);
  this.allDependencies = getDependencies.call(this);
  this.fs.copyTpl(this.templatePath(`${templateDir}/src/**/*`), path.join(destinationPath, 'src'), { data: this.options });
  this.fs.write(path.join(destinationPath, '.neutrinorc.js'), makeRcFile(this.data));

  if (this.data.testRunner) {
    const testDestinationDir = path.join(destinationPath, 'test');

    ensureDirSync(testDestinationDir);

    this.fs.copy(
      this.templatePath(path.join('test', `${this.data.testRunner}.js`)),
      path.join(testDestinationDir, 'simple_test.js')
    );

    this.fs.copy(
      this.templatePath('eslintrc.js'),
      path.join(destinationPath, '.eslintrc.js')
    );
  }
};
