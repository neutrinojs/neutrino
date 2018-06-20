#!/usr/bin/env bash

set -euo pipefail

export SKIP_CHANGELOG=true
export YARN_AUTH_TOKEN="//localhost:4873/:_authToken=token"

# Start verdaccio registry proxy in the background
yarn verdaccio --config verdaccio.yml &

# Verdaccio isn't ready to immediately accept connections, so we need to wait
while ! nc -zw 1 localhost 4873; do sleep 1; done

# Publish all monorepo packages to the verdaccio registry.
# The version will be bumped to the next pre-release suffix (`-0`) and the
# package.json changes left in the working directory so that create-project
# can read the correct version for installing matching monorepo packages.
yarn release \
  --registry http://localhost:4873/ \
  --yes \
  --skip-git \
  --cd-version prerelease

# Run the integration tests, which will install packages
# from the verdaccio registry
yarn test:create-project

# Remove cached Neutrino packages to avoid Travis cache churn.
# Not using `yarn cache clean` since it doesn't support globs,
# and does nothing more than call `fs.unlink(dir)` anyway.
YARN_CACHE_DIR="$(yarn cache dir)"
rm -rf "${YARN_CACHE_DIR}"/*-neutrino-*/ "${YARN_CACHE_DIR}"/*-@neutrinojs/
