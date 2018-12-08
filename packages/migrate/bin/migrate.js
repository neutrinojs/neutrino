#!/usr/bin/env node

const yargs = require('yargs');
const { run } = require('jscodeshift/src/Runner');
const { join, resolve } = require('path');

const transforms = {
  rc: ['.neutrinorc.js']
};
const types = Object.keys(transforms);
const cli = yargs
  .command('[...tasks]', `Perform migration tasks: ${types.join(', ')}`)
  .option('dry', {
    alias: 'd',
    description: 'dry run (no changes are made to files)',
    boolean: true
  })
  .option('print', {
    alias: 'p',
    description: 'print transformed files to stdout, useful for development',
    boolean: true
  })
  .option('silent', {
    alias: 's',
    description: 'do not write to stdout or stderr',
    boolean: true
  })
  .help()
  .wrap(null)
  .argv;

cli._.forEach(positional => {
  if (!types.includes(positional)) {
    throw new Error(
      `"${positional}" is not a valid transformation. Valid choices are: ${
        types.join(', ')
      }`
    );
  }
});

Promise
  .all(cli._.map(positional =>
    run(
      resolve(__dirname, `../transforms/${positional}.js`),
      transforms[positional].map(file => join(process.cwd(), file)),
      { dry: cli.dry, silent: cli.silent, print: cli.print }
    )))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
