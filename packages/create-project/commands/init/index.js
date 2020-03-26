const {
  ensureDirSync,
  pathExistsSync,
  readJsonSync,
  removeSync,
  writeJsonSync,
} = require('fs-extra');
const { basename, join, relative } = require('path');
const { cyan, green, white, yellow } = require('chalk');
const merge = require('deepmerge');
const Generator = require('yeoman-generator');
const { appendFileSync } = require('fs');
const {
  packageLint,
  packageManager,
  rcTemplate,
  getNeutrinorcOptions,
} = require('./utils');
const { presets, questions, LIBRARY, NONE, LOGO } = require('./constants');

/* eslint-disable no-underscore-dangle */
module.exports = class Project extends Generator {
  _spawnSync(cmd) {
    const [command, ...args] = cmd.split(' ');
    const { directory, stdio, debug } = this.options;
    const result = this.spawnCommandSync(command, args, {
      cwd: directory,
      stdio,
      env: process.env,
    });

    if (result.error || result.status !== 0) {
      if (result.error) {
        // The child process failed to start entirely, or timed out.
        this.log.error(result.error);
      }

      this.log.error(`The command "${cmd}" exited unsuccessfully.`);

      if (!debug) {
        this.log.error('Cleaning up the incomplete project directory.');
        removeSync(directory);
        this.log.error(
          'Try again with the --debug flag for more information and to skip cleanup.',
        );
      }

      process.exit(result.status || 1);
    }

    return result;
  }

  async prompting() {
    const done = this.async();

    this.log(cyan.bold(LOGO));
    this.log(white.bold('Welcome to Neutrino! 👋'));
    this.log(
      cyan(
        'To help you create your new project, I am going to ask you a few questions.\n',
      ),
    );

    const answers = await this.prompt(questions);
    const project = presets.get(answers.project);
    const testRunner = presets.get(answers.testRunner);
    const linter = presets.get(answers.linter);
    const packageJsons = [
      project.packageJson,
      testRunner && testRunner.packageJson,
      linter &&
        merge(
          linter.packageJson,
          packageLint(
            answers.project.includes('react'),
            answers.project.includes('vue'),
            testRunner,
          ),
        ),
    ].filter(Boolean);
    const packageJson =
      packageJsons.length > 1 ? merge.all(packageJsons) : packageJsons[0];

    this.data = {
      ...answers,
      project,
      testRunner,
      linter,
      packageJson,
    };

    this.log(
      `\n👌  ${white.bold(
        'Looks like I have all the info I need. Give me a moment while I create your project!',
      )}\n`,
    );
    done();
  }

  writing() {
    const { directory, name } = this.options;

    if (pathExistsSync(directory)) {
      this.log.error(
        `The directory ${directory} already exists. ` +
          'For safety, please use create-project with a non-existent directory.',
      );
      process.exit(1);
    }

    ensureDirSync(directory);

    const { project, testRunner, linter, packageJson } = this.data;
    const { dependencies, devDependencies, ...pkgJson } = packageJson;
    const jsonPath = join(directory, 'package.json');

    this._spawnSync(packageManager('init --yes'));
    writeJsonSync(jsonPath, merge(readJsonSync(jsonPath), pkgJson), {
      spaces: 2,
    });
    this.log(
      `   ${green('create')} ${join(basename(directory), 'package.json')}`,
    );

    const presets = [linter, project, testRunner].filter(
      (preset) => preset && preset !== NONE,
    );
    const neutrinorc = rcTemplate({
      middleware: presets.map((middleware) => {
        const options = middleware.options
          ? getNeutrinorcOptions(name, middleware)
          : '';

        return { ...middleware, options };
      }),
    });

    this._spawnSync('npx gitignore node');
    appendFileSync(
      join(directory, '.gitignore'),
      '\n# Neutrino build directory\nbuild',
    );
    this.fs.write(join(directory, '.neutrinorc.js'), neutrinorc);
    presets.forEach((preset) => {
      const templateDir = preset.package.replace('@neutrinojs/', '');

      this.fs.copyTpl(
        this.templatePath(`${templateDir}/**`),
        directory,
        { data: this.options },
        {},
        { globOptions: { dot: true } },
      );
    });
  }

  install() {
    const { registry } = this.options;
    const { dependencies, devDependencies } = this.data.packageJson;

    this.log('');

    if (dependencies && dependencies.length) {
      this.log(
        `${green('⏳  Installing dependencies:')} ${yellow(
          dependencies.join(', '),
        )}`,
      );
      this._spawnSync(
        packageManager(`add ${dependencies.sort().join(' ')}`, registry),
      );
    }

    if (devDependencies && devDependencies.length) {
      this.log(
        `${green('⏳  Installing devDependencies:')} ${yellow(
          devDependencies.join(', '),
        )}`,
      );
      this._spawnSync(
        packageManager(
          `add --dev ${devDependencies.sort().join(' ')}`,
          registry,
        ),
      );
    }

    if (this.data.linter) {
      this.log(`${green('⏳  Performing one-time lint')}`);
      this._spawnSync(packageManager('run lint --fix'));
    }
  }

  end() {
    const { directory } = this.options;
    const { projectType, testRunner, linter } = this.data;

    this.log(`\n${green('Hooray, I successfully created your project!')}`);
    this.log(
      `\nI have added a few ${packageManager()} scripts to help you get started:`,
    );
    this.log(
      `  • To build your project run:  ${cyan.bold(
        packageManager('run build'),
      )}`,
    );

    if (projectType !== LIBRARY) {
      this.log(
        `  • To start your project locally run:  ${cyan.bold(
          packageManager('start'),
        )}`,
      );
    }

    if (testRunner !== NONE) {
      this.log(
        `  • To execute tests run:  ${cyan.bold(packageManager('test'))}`,
      );
    }

    if (linter !== NONE) {
      this.log(
        `  • To lint your project manually run:  ${cyan.bold(
          packageManager('run lint'),
        )}`,
      );
      this.log(
        `    You can also fix linting problems with:  ${cyan.bold(
          packageManager('run lint --fix'),
        )}`,
      );
    }

    this.log('\nNow change your directory to the following to get started:');
    this.log(`  ${cyan('cd')} ${cyan(relative(process.cwd(), directory))}`);
    this.log(`\n❤️  ${white.bold('Neutrino')}`);
  }
};
