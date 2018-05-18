#!/usr/bin/env bash

set -euo pipefail

export SKIP_CHANGELOG=true
export YARN_AUTH_TOKEN="//localhost:4873/:_authToken=token"

# Start verdaccio registry proxy in the background
yarn verdaccio --config verdaccio.yml &

# Verdaccio isn't ready to immediately accept connections, so we need to wait
while ! nc -zw 1 localhost 4873; do sleep 1; done

# Publish all monorepo packages to the verdaccio registry.
# Canary mode ensures no git or working directory changes are made, but we
# have to override the tag from `canary` to `latest` so create-project works.
# The minor version will be bumped and a `-alpha.GIT_SHA` suffix added, which
# should help avoid errors from clashing with an already-published version.
yarn release \
  --registry http://localhost:4873/ \
  --yes \
  --canary \
  --npm-tag latest

# Run the integration tests, which will install packages
# from the verdaccio registry
yarn test:create-project

# Remove cached Neutrino packages to avoid Travis cache churn.
# Not using `yarn cache clean` since it doesn't support globs,
# and does nothing more than call `fs.unlink(dir)` anyway.
YARN_CACHE_DIR="$(yarn cache dir)"
rm -rf "${YARN_CACHE_DIR}"/*-neutrino-*/ "${YARN_CACHE_DIR}"/*-@neutrinojs/
