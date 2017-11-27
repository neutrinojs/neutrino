const { ensureDirSync, readJsonSync, writeJsonSync } = require('fs-extra');
const { join, relative } = require('path');
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
          title: this.options.name
        }
      }]);
    } else if (data.projectType === 'library') {
      rc.use.push([data.project, {
        name: this.options.name
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
      cwd: this.options.directory,
      stdio: 'ignore'
    });

    command.on('close', () => {
      const jsonPath = join(this.options.directory, 'package.json');
      const json = readJsonSync(jsonPath);
      const packageJson = Object.assign(json, { scripts });

      writeJsonSync(jsonPath, packageJson, { spaces: 2 });

      return done();
    });
  }

  prompting() {
    const done = this.async();

    this.log(chalk.cyan.bold(this._logo()));
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
    const templateDir = this.data.project.replace('@neutrinojs/', '');

    this._initialPackageJson();
    this.fs.copyTpl(
      this.templatePath(`${templateDir}/src/**/*`),
      join(this.options.directory, 'src'),
      { data: this.options }
    );
    this.fs.write(join(this.options.directory, '.neutrinorc.js'), this._makeRcFile(this.data));

    if (this.data.testRunner) {
      const testDestinationDir = join(this.options.directory, 'test');

      ensureDirSync(testDestinationDir);
      this.fs.copy(
        this.templatePath(join('test', `${this.data.testRunner.replace('@neutrinojs/', '')}.js`)),
        join(testDestinationDir, 'simple_test.js')
      );
    }

    if (this.data.linter) {
      this.fs.copy(
        this.templatePath('eslintrc.js'),
        join(this.options.directory, '.eslintrc.js')
      );
    }
  }

  install() {
    const packageManager = isYarn ? 'yarn' : 'npm';
    const install = isYarn ? 'add' : 'install';
    const devFlag = isYarn ? '--dev' : '--save-dev';
    const { dependencies, devDependencies } = this._getDependencies();

    this.log(`\n${chalk.green('success')} Saved package.json`);

    if (dependencies) {
      this.log(`\n${chalk.green('Installing dependencies:')} ${chalk.yellow(dependencies.join(', '))}`);
      this.spawnCommandSync(packageManager, [install, ...dependencies], {
        cwd: this.options.directory,
        stdio: this.options.stdio,
        env: process.env
      });
    }

    if (devDependencies) {
      if (process.env.NODE_ENV === 'test') {
        const remote = devDependencies.filter(d => !d.includes('neutrino'));
        const local = devDependencies.filter(d => d.includes('neutrino'));

        if (remote.length) {
          this.log(`\n${chalk.green('Installing remote devDependencies:')} ${chalk.yellow(remote.join(', '))}`);
          this.spawnCommandSync(packageManager, [install, devFlag, ...remote], {
            stdio: this.options.stdio,
            env: process.env,
            cwd: this.options.directory
          });
        }

        if (local.length) {
          this.log(`\n${chalk.green('Linking local devDependencies:')} ${chalk.yellow(local.join(', '))}`);
          this.spawnCommandSync('yarn', ['link', ...local], {
            stdio: this.options.stdio,
            env: process.env,
            cwd: this.options.directory
          });
        }
      } else {
        this.log(`\n${chalk.green('Installing devDependencies:')} ${chalk.yellow(devDependencies.join(', '))}`);
        this.spawnCommandSync(packageManager, [install, devFlag, ...devDependencies], {
          stdio: this.options.stdio,
          env: process.env,
          cwd: this.options.directory
        });
      }
    }

    if (this.data.linter) {
      this.spawnCommandSync('neutrino', ['lint', '--fix'], {
        stdio: this.options.stdio === 'inherit' ? 'ignore' : this.options.stdio,
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
    this.log(`  ${chalk.cyan(relative(process.cwd(), this.options.directory))}`);
    this.log(`\n❤️  ${chalk.white.bold('Neutrino')}`);
  }
};
