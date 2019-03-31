/* eslint-disable import/no-extraneous-dependencies */
const { exec, spawn } = require('child-process-async');
const { remove } = require('fs-extra');
const { join } = require('path');

const SERVER = 'http://localhost:4873/';
const cwd = join(__dirname, '..');
const env = {
  ...process.env,
  SKIP_CHANGELOG: true,
  YARN_AUTH_TOKEN: `${SERVER.split('http')[1]}:_authToken=token`,
};
const handleError = async err => {
  console.error(err);
  process.exit(1);
};

process.on('unhandledRejection', handleError);

async function main() {
  const { stdout } = await exec('yarn cache dir');
  const cacheDirectory = stdout.toString().trim();

  // Run the integration tests, which will install packages
  // from the verdaccio registry
  // ava --verbose packages/create-project/test
  await spawn('node', ['node_modules/'], { env, cwd, stdio: 'inherit' });

  // Remove cached Neutrino packages to avoid Travis cache churn.
  // Not using `yarn cache clean` since it doesn't support globs,
  // and does nothing more than call `fs.unlink(dir)` anyway.
  // Also take care of cleaning up the version changes in the repo.
  await Promise.all([
    remove(join(cacheDirectory, '*-neutrino-*')),
    remove(join(cacheDirectory, '*-@neutrinojs')),
  ]);
}

main().catch(handleError);
