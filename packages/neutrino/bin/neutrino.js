#!/usr/bin/env node

const yargsParser = require('yargs-parser');
const { join } = require('path');
const neutrino = require('..');

const argv = yargsParser(process.argv.slice(2));

if (argv.inspect) {
  if (argv.config) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const middleware = require(join(process.cwd(), argv.config));
    neutrino(middleware).inspect();
    process.exit();
  }
  neutrino().inspect();
  process.exit();
}

console.error(`
The "neutrino start/build/lint/test" commands were removed in Neutrino 9.
Please see the migration guide for how to upgrade your project:
https://neutrinojs.org/migration-guide/

You may still inspect the generated webpack configuration using:
neutrino --inspect --mode {production,development}
or inspect with custom config
neutrino --inspect --mode {production,development} --config .custom.neutrino.config
`);

process.exit(1);
