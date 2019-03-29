/* eslint-disable import/no-extraneous-dependencies */
const { CLIEngine } = require('eslint');
const glob = require('glob');
const { resolve } = require('path');

const cwd = resolve(__dirname, '..');
const files = glob.sync('{.eslintrc.js,packages/*/eslintrc.js}', { cwd });

files.forEach(file => {
  const cli = new CLIEngine({
    useEslintrc: false,
    configFile: resolve(__dirname, '..', file),
  });

  cli.getConfigForFile(cwd);
});
