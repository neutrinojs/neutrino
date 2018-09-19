#!/usr/bin/env node

const yargsParser = require('yargs-parser');
const neutrino = require('..');

const argv = yargsParser(process.argv.slice(2));

if (argv.inspect) {
  neutrino().inspect();
  process.exit();
}

console.error(`
The "neutrino start/build/lint" commands have been removed starting with v9.
Please see the migration guide at https://neutrinojs.org/migration-guide
for details on upgrading your installation.

You may still inspect the generated webpack configuration with "neutrino --inspect".
`);

process.exit(1);
