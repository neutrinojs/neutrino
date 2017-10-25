#!/usr/bin/env node

'use strict';

const yeoman = require('yeoman-environment');
const Vorpal = require('vorpal');
const path = require('path');
const commands = require('../package.json').commands;

const cli = new Vorpal();
const env = yeoman.createEnv();

const register = (command) => {
  const name = command.name;
  const dir = path.resolve(__dirname, `../commands/${name}`);

  env.register(require.resolve(dir), `create-neutrino-project:${name}`);

  cli
    .command(name, command.description)
    .action(function (args) {
      const done = exitCode => process.exit(exitCode || 0);

      env.run(`create-neutrino-project:${name}`, done);
    });
};

commands.map(register);

cli
  .find('exit')
  .hidden();

cli.parse.apply(cli, process.argv[2] ? [process.argv] : process.argv.concat(['help']));
