#! /usr/bin/env bash

set -euo pipefail

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
