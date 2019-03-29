/* eslint-disable import/no-extraneous-dependencies */
const waitOn = require('wait-on');
const { exec, spawn } = require('child-process-async');
const { remove } = require('fs-extra');
const { join } = require('path');

const SERVER = 'http://localhost:4873/';
const env = {
  ...process.env,
  YARN_AUTH_TOKEN: `${SERVER.split('http')[1]}:_authToken=token`,
};
// Start verdaccio registry proxy in the background
const server = spawn('yarn', ['verdaccio', '--config', 'verdaccio.yml'], {
  env,
  stdio: 'inherit',
  detached: true,
});
const kill = () => {
  server.kill();
};
const resetVersionBump = () =>
  exec('git checkout lerna.json packages/*/package.json');
const handleError = async err => {
  console.error(err);
  kill();
  await resetVersionBump();
  process.exit(1);
};

process.on('unhandledRejection', handleError);
process.on('SIGINT', () => {
  kill();
  resetVersionBump();
});

async function main() {
  const { stdout } = await exec('yarn cache dir');
  const cacheDirectory = stdout.toString().trim();

  // Verdaccio isn't ready to immediately accept connections, so we need to wait
  await waitOn({ resources: [SERVER] });

  // Publish all monorepo packages to the verdaccio registry.
  // The version will be bumped to the next pre-release suffix (`-0`) and the
  // package.json changes left in the working directory so that create-project
  // can read the correct version for installing matching monorepo packages.
  await exec(`yarn release:ci`, { env, stdio: 'inherit' });

  // Run the integration tests, which will install packages
  // from the verdaccio registry
  await spawn('yarn', ['test:create-project'], { env, stdio: 'inherit' });

  // Stop the verdaccio server
  kill();

  // Remove cached Neutrino packages to avoid Travis cache churn.
  // Not using `yarn cache clean` since it doesn't support globs,
  // and does nothing more than call `fs.unlink(dir)` anyway.
  // Also take care of cleaning up the version changes in the repo.
  await Promise.all([
    remove(join(cacheDirectory, '*-neutrino-*')),
    remove(join(cacheDirectory, '*-@neutrinojs')),
    resetVersionBump(),
  ]);
}

main().catch(handleError);
