#!/usr/bin/env node

const yeoman = require('yeoman-environment');
const yargs = require('yargs');
const path = require('path');

const env = yeoman.createEnv();
const done = exitCode => process.exit(exitCode || 0);
const dir = path.resolve(__dirname, '../commands/init');

env.register(require.resolve(dir), 'create-neutrino-project:init');

const cli = yargs.command('<project-directory>')
  .demandCommand(1, 'Only <project-directory> is required')
  .help()
  .argv;

env.run('create-neutrino-project:init', { directory: cli._[0] }, done);
