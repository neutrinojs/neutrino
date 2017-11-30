#!/usr/bin/env node

const yargs = require('yargs');
const { createEnv } = require('yeoman-environment');
const { basename, isAbsolute, join, resolve } = require('path');

const env = createEnv();
const done = exitCode => process.exit(exitCode || 0);
const dir = resolve(__dirname, '../commands/init');

env.register(require.resolve(dir), 'create-neutrino-project');

const cli = yargs.command('<project-directory>')
  .demandCommand(1, 'Only <project-directory> is required')
  .help()
  .argv;
const directory = isAbsolute(cli._[0]) ? cli._[0] : join(process.cwd(), cli._[0]);
const name = basename(directory);

env.run('create-neutrino-project', {
  directory,
  name,
  stdio: process.env.NODE_ENV === 'test' ? 'ignore' : 'inherit'
}, done);
