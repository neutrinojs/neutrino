#!/usr/bin/env node

const yargs = require('yargs');
const { run } = require('jscodeshift/src/Runner');
const { resolve } = require('path');
const { existsSync } = require('fs');

const cli = yargs
  .scriptName('migrate')
  .command(
    '$0 [files..]',
    'Migrate Neutrino middleware to the latest version via codemods',
    (yargs) => {
      yargs.positional('files', {
        array: true,
        description: 'files to migrate',
        default: ['.neutrinorc.js'],
      });
    },
  )
  .option('dry', {
    alias: 'd',
    description: 'dry run (no changes are made to files)',
    boolean: true,
  })
  .option('print', {
    alias: 'p',
    description: 'print transformed files to stdout, useful for development',
    boolean: true,
  })
  .option('silent', {
    alias: 's',
    description: 'do not write to stdout or stderr',
    boolean: true,
  })
  .help()
  .wrap(null).argv;

run(
  resolve(__dirname, '../transforms/middleware.js'),
  cli.files.map((file) => {
    const resolved = resolve(process.cwd(), file);

    if (!existsSync(resolved)) {
      throw new Error(`Cannot find file '${resolved}'`);
    }

    return resolved;
  }),
  { dry: cli.dry, silent: cli.silent, print: cli.print },
).catch((err) => {
  console.error(err);
  process.exit(1);
});
