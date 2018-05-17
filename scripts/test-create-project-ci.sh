#! /usr/bin/env bash

set -euo pipefail

export SKIP_CHANGELOG=true
export YARN_AUTH_TOKEN="//localhost:4873/:_authToken=token"

# Start verdaccio registry proxy in the background
yarn verdaccio --config verdaccio.yml &
yarn config set registry "http://localhost:4873"

# Verdaccio isn't ready to immediately accept connections, so we need to wait
while ! nc -zw 1 localhost 4873; do sleep 1; done

# Publish all monorepo packages to the verdaccio registry
yarn lerna publish \
  --force-publish=* \
  --skip-git \
  --registry http://localhost:4873/ \
  --yes \
  --cd-version major

# Run the integration tests, which will install packages
# from the verdaccio registry
yarn test:create-project
