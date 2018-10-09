#!/usr/bin/env node

const yargsParser = require('yargs-parser');
const neutrino = require('..');

const argv = yargsParser(process.argv.slice(2));

if (argv.inspect) {
  neutrino().inspect();
  process.exit();
}

console.error(`
The "neutrino start/build/lint/test" commands were removed in Neutrino 9.
Please see the migration guide for how to upgrade your project:
https://neutrinojs.org/migration-guide/

You may still inspect the generated webpack configuration using:
neutrino --inspect --mode {production,development}
`);

process.exit(1);
