const { ensureDirSync, readJsonSync, writeJsonSync } = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const stringify = require('javascript-stringify');
const merge = require('deepmerge');
const Generator = require('yeoman-generator');
const questions = require('./questions');
const { projects, isYarn } = require('./utils');

/* eslint-disable no-underscore-dangle */
module.exports = class Project extends Generator {
  _logo() {
    return `                          _          _
      _ __    ___  _   _ | |_  _ __ (_) _ __    ___
     | '_ \\  / _ \\| | | || __|| '__|| || '_ \\  / _ \\
     | | | ||  __/| |_| || |_ | |   | || | | || (_) |
     |_| |_| \\___| \\__,_| \\__||_|   |_||_| |_| \\___/
    `;
  }

  _makeRcFile(data) {
    const rc = { use: [] };

    if (data.linter) {
      rc.use.push(data.linter);
    }

    if (data.projectType === 'application' && data.project !== '@neutrinojs/node') {
      rc.use.push([data.project, {
        html: {
          title: this.options.directory
        }
      }]);
    } else if (data.projectType === 'library') {
      rc.use.push([data.project, {
        name: this.options.directory
      }]);
    } else {
      rc.use.push(data.project);
    }

    if (data.testRunner) {
      rc.use.push(data.testRunner);
    }

    return `module.exports = ${stringify(rc, null, 2)};\n`;
  }

  _getDependencies() {
    const deps = [this.data.project, this.data.testRunner, this.data.linter]
      .reduce(
        (deps, project) => merge(deps, projects[project] || {}),
        { dependencies: [], devDependencies: [] }
      );

    if (deps.dependencies.length && deps.devDependencies.length) {
      return deps;
    } else if (deps.dependencies.length) {
      return { dependencies: deps.dependencies };
    } else if (deps.devDependencies.length) {
      return { devDependencies: deps.devDependencies };
    }
    return {};
  }

  _initialPackageJson() {
    const done = this.async();
    const installer = isYarn ? 'yarn' : 'npm';
    const scripts = { build: 'neutrino build' };

    if (this.data.projectType !== 'library') {
      scripts.start = 'neutrino start';
    }

    if (this.data.linter) {
      scripts.lint = 'neutrino lint';
    }

    if (this.data.testRunner) {
      scripts.test = 'neutrino test';
    }

    ensureDirSync(this.options.directory);

    const command = this.spawnCommand(installer, ['init', '--yes'], {
      cwd: path.resolve(this.options.directory),
      stdio: 'ignore'
    });

    command.on('close', () => {
      const jsonPath = path.join(this.options.directory, 'package.json');
      const json = readJsonSync(`./${jsonPath}`);
      const packageJson = Object.assign(json, { scripts });

      writeJsonSync(jsonPath, packageJson, { spaces: 2 });

      return done();
    });
  }

  prompting() {
    const done = this.async();

    console.log(chalk.cyan.bold(this._logo()));
    console.log(chalk.magenta.bold('Welcome to Neutrino!'));
    console.log(chalk.cyan('To help you create your new project, I am going to ask you a few questions. :)\n'));

    this
      .prompt(questions())
      .then(answers => this.data = answers)
      .then(() => done());
  }

  writing() {
    const destinationPath = this.destinationPath(this.options.directory);
    const templateDir = this.data.project.replace('@neutrinojs/', '');

    this._initialPackageJson();
    this.fs.copyTpl(
      this.templatePath(`${templateDir}/src/**/*`),
      path.join(destinationPath, 'src'),
      { data: this.options }
    );
    this.fs.write(path.join(destinationPath, '.neutrinorc.js'), this._makeRcFile(this.data));

    if (this.data.testRunner) {
      const testDestinationDir = path.join(destinationPath, 'test');

      ensureDirSync(testDestinationDir);
      this.fs.copy(
        this.templatePath(path.join('test', `${this.data.testRunner.replace('@neutrinojs/', '')}.js`)),
        path.join(testDestinationDir, 'simple_test.js')
      );
    }

    if (this.data.linter) {
      this.fs.copy(
        this.templatePath('eslintrc.js'),
        path.join(destinationPath, '.eslintrc.js')
      );
    }
  }

  install() {
    const installer = isYarn ? 'yarn' : 'npm';
    const argument = isYarn ? 'add' : 'install';
    const development = isYarn ? '--dev' : '--save-dev';
    const { dependencies, devDependencies } = this._getDependencies();

    this.log(`\n${chalk.green('success')} Saved package.json`);
    process.chdir(this.options.directory);

    if (dependencies) {
      this.log(`\n${chalk.green('Installing dependencies:')} ${chalk.yellow(dependencies.join(', '))}`);
      this.spawnCommandSync(installer, [argument, ...dependencies], { stdio: 'inherit' });
    }

    if (devDependencies) {
      this.log(`\n${chalk.green('Installing dev-dependencies:')} ${chalk.yellow(devDependencies.join(', '))}`);
      this.spawnCommandSync(installer, [argument, development, ...devDependencies], { stdio: 'inherit' });
    }

    if (this.data.linter) {
      this.spawnCommandSync('neutrino', ['lint', '--fix'], { stdio: 'ignore' });
    }
  }

  end() {
    this.log(`\n${chalk.green('Success!')} Created ${chalk.cyan(this.options.directory)} at ${chalk.yellow(process.cwd())}`);
    this.log(`To get started, change your current working directory to: ${chalk.cyan(this.options.directory)}`);
  }
};
