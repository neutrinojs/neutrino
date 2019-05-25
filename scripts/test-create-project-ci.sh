#!/usr/bin/env bash

set -euo pipefail

if [[ "$CREATE_PROJECT_YARN" = "true" ]]
then
  export YARN_AUTH_TOKEN="//localhost:4873/:_authToken=token"

  # Start verdaccio registry proxy in the background
  yarn verdaccio --config verdaccio.yarn.yml &

  # Verdaccio isn't ready to immediately accept connections, so we need to wait
  while ! nc -zw 1 localhost 4873; do sleep 1; done

  # Publish all monorepo packages to the verdaccio registry.
  # The version will be bumped to the next minor version with a pre-release suffix,
  # and the package.json changes left in the working directory so that create-project
  # can read the correct version for installing matching monorepo packages.
  yarn release:ci

  # Run the integration tests, which will install packages
  # from the verdaccio registry
  yarn test:create-project

  # Remove cached Neutrino packages to avoid Travis cache churn.
  # Not using `yarn cache clean` since it doesn't support globs,
  # and does nothing more than call `fs.unlink(dir)` anyway.
  YARN_CACHE_DIR="$(yarn cache dir)"
  rm -rf "${YARN_CACHE_DIR}"/*-neutrino-*/ "${YARN_CACHE_DIR}"/*-@neutrinojs/
else
  echo "//localhost:4873/:_authToken=token" > .npmrc

  # Start verdaccio registry proxy in the background
  node_modules/.bin/verdaccio --config verdaccio.npm.yml &

  # Verdaccio isn't ready to immediately accept connections, so we need to wait
  while ! nc -zw 1 localhost 4873; do sleep 1; done

  # Publish all monorepo packages to the verdaccio registry.
  # The version will be bumped to the next minor version with a pre-release suffix,
  # and the package.json changes left in the working directory so that create-project
  # can read the correct version for installing matching monorepo packages.
  npm run release:ci

  # Run the integration tests, which will install packages
  # from the verdaccio registry
  npm run test:create-project

  # Remove cached Neutrino packages to avoid Travis cache churn.
  npm_config_cache="$(npm config get cache --global)"
  rm -rf "${npm_config_cache}"/*-neutrino-*/ "${npm_config_cache}"/*-@neutrinojs/
fi

