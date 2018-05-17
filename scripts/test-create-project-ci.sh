#! /usr/bin/env bash

set -euo pipefail

export SKIP_CHANGELOG=true
export YARN_AUTH_TOKEN="//localhost:4873/:_authToken=token"

yarn verdaccio --config verdaccio.yml & sleep 10
yarn config set registry "http://localhost:4873"
npm config set registry "http://localhost:4873"
yarn lerna publish \
  --force-publish=* \
  --skip-git \
  --registry http://localhost:4873/ \
  --yes \
  --cd-version patch
yarn test:create-project
