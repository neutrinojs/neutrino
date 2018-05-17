const { ensureDirSync, readJsonSync, writeJsonSync } = require('fs-extra');
const { basename, join, relative } = require('path');
const chalk = require('chalk');
const stringify = require('javascript-stringify');
const merge = require('deepmerge');
const Generator = require('yeoman-generator');
const questions = require('./questions');
const { projects, packages, isYarn } = require('./utils');

/* eslint-disable no-underscore-dangle */
module.exports = class Project extends Generator {
  static _logo() {
    return `                          _          _
      _ __    ___  _   _ | |_  _ __ (_) _ __    ___
     | '_ \\  / _ \\| | | || __|| '__|| || '_ \\  / _ \\
     | | | ||  __/| |_| || |_ | |   | || | | || (_) |
     |_| |_| \\___| \\__,_| \\__||_|   |_||_| |_| \\___/
    `;
  }

  _getProjectMiddleware() {
    const { projectType, project } = this.data;

    if (projectType === 'application' && project !== packages.NODE) {
      return [project, {
        html: {
          title: this.options.name
        }
      }];
    } else if (projectType === 'library') {
      return [project, {
        name: this.options.name
      }];
    }

    return project;
  }

  _getNeutrinorcContent() {
    const rc = {
      use: [
        this.data.linter,
        this._getProjectMiddleware(),
        this.data.testRunner
      ].filter(Boolean)
    };

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
    const installer = isYarn ? 'yarn' : 'npm';
    const scripts = { build: `${packages.NEUTRINO} build` };

    if (this.data.projectType !== 'library') {
      scripts.start = `${packages.NEUTRINO} start`;
    }

    if (this.data.linter) {
      scripts.lint = `${packages.NEUTRINO} lint`;
    }

    if (this.data.testRunner) {
      scripts.test = `${packages.NEUTRINO} test`;
    }

    ensureDirSync(this.options.directory);

    this.spawnCommandSync(installer, ['init', '--yes'], {
      cwd: this.options.directory,
      stdio: this.options.stdio
    });

    const jsonPath = join(this.options.directory, 'package.json');
    const json = readJsonSync(jsonPath);
    const packageJson = { ...json, scripts };

    writeJsonSync(jsonPath, packageJson, { spaces: 2 });
    this.log(`   ${chalk.green('create')} ${join(basename(this.options.directory), 'package.json')}`);
  }

  prompting() {
    const done = this.async();

    this.log(chalk.cyan.bold(Project._logo()));
    this.log(chalk.white.bold('Welcome to Neutrino! 👋'));
    this.log(chalk.cyan('To help you create your new project, I am going to ask you a few questions.\n'));

    this
      .prompt(questions())
      .then(answers => this.data = answers)
      .then(() => {
        this.log(`\n👌  ${chalk.white.bold('Looks like I have all the info I need. Give me a moment while I create your project!')}\n`);
        done();
      });
  }

  writing() {
    const templates = [this.data.project, this.data.testRunner, this.data.linter].filter(Boolean);

    this._initialPackageJson();
    this.fs.write(
      join(this.options.directory, '.neutrinorc.js'),
      this._getNeutrinorcContent()
    );
    templates.forEach(template => {
      const templateDir = template.replace('@neutrinojs/', '');

      this.fs.copyTpl(
        this.templatePath(`${templateDir}/**`),
        this.options.directory,
        { data: this.options },
        {},
        { globOptions: { dot: true } }
      );
    });
  }

  install() {
    const packageManager = isYarn ? 'yarn' : 'npm';
    const install = isYarn ? 'add' : 'install';
    const devFlag = isYarn ? '--dev' : '--save-dev';
    const { dependencies, devDependencies } = this._getDependencies();

    this.log('');

    if (dependencies) {
      this.log(`${chalk.green('⏳  Installing dependencies:')} ${chalk.yellow(dependencies.join(', '))}`);
      this.spawnCommandSync(
        packageManager,
        [
          install,
          ...(
            this.options.registry
              ? ['--registry', this.options.registry] :
              []
          ),
          ...dependencies
        ],
        {
          cwd: this.options.directory,
          stdio: this.options.stdio,
          env: process.env
        }
      );
    }

    if (devDependencies) {
      this.log(`${chalk.green('⏳  Installing devDependencies:')} ${chalk.yellow(devDependencies.join(', '))}`);
      this.spawnCommandSync(
        packageManager,
        [
          install,
          devFlag,
          ...(
            this.options.registry
              ? ['--registry', this.options.registry] :
              []
          ),
          ...devDependencies
        ],
        {
          cwd: this.options.directory,
          stdio: this.options.stdio,
          env: process.env
        }
      );
    }

    if (this.data.linter) {
      this.log(`${chalk.green('⏳  Performing one-time lint')}`);
      this.spawnCommandSync(packageManager,
        isYarn
          ? ['lint', '--fix']
          : ['run', 'lint', '--fix'],
        {
          stdio: this.options.stdio === 'inherit' || !this.options.stdio
            ? 'ignore' :
            this.options.stdio,
          env: process.env,
          cwd: this.options.directory
        });
    }
  }

  end() {
    this.log(`\n${chalk.green('Hooray, I successfully created your project!')}`);
    this.log(`\nI have added a few ${isYarn ? 'yarn' : 'npm'} scripts to help you get started:`);
    this.log(`  • To build your project run:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm run'} build`)}`);

    if (this.data.projectType !== 'library') {
      this.log(`  • To start your project locally run:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm'} start`)}`);
    }

    if (this.data.testRunner) {
      this.log(`  • To execute tests run:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm'} test`)}`);
    }

    if (this.data.linter) {
      this.log(`  • To lint your project manually run:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm run'} lint`)}`);
      this.log(`    You can also fix some linting problems with:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm run'} lint --fix`)}`);
    }

    this.log('\nNow change your directory to the following to get started:');
    this.log(`  ${chalk.cyan('cd')} ${chalk.cyan(relative(process.cwd(), this.options.directory))}`);
    this.log(`\n❤️  ${chalk.white.bold('Neutrino')}`);
  }
};
