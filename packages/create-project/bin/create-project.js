#!/usr/bin/env node

const yargs = require('yargs');
const { createEnv } = require('yeoman-environment');
const { basename, isAbsolute, join, resolve } = require('path');

const env = createEnv();
const done = (exitCode) => process.exit(exitCode || 0);
const dir = resolve(__dirname, '../commands/init');

env.register(require.resolve(dir), 'create-project');

const cli = yargs
  .command('<project-directory>')
  .option('debug', { description: 'Run in debug mode' })
  .option('registry', { description: 'Specify an alternate npm registry' })
  .demandCommand(1, 'Only <project-directory> is required')
  .help()
  .wrap(null).argv;
const directory = isAbsolute(cli._[0])
  ? cli._[0]
  : join(process.cwd(), cli._[0]);
const name = basename(directory);

env.run(
  'create-project',
  {
    directory,
    name,
    registry: cli.registry,
    debug: !!cli.debug,
    stdio: cli.debug ? 'inherit' : 'ignore',
  },
  done,
);
