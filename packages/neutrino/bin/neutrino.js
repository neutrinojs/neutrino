#!/usr/bin/env node

const yargs = require('yargs');

const args = yargs.parse(process.argv);

if (args.inspect) {
  // eslint-disable-next-line global-require
  require('../')().inspect();
}

console.error(`
The "neutrino" command has been removed for building starting with v9.
Please see the migration guide at https://neutrinojs.org/migration-guide
for details on upgrading your installation.

You may still inspect the generated webpack configuration with --inspect.
`);

process.exit(1);
