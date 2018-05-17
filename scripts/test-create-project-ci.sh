#! /usr/bin/env bash

set -euo pipefail

yarn verdaccio --config verdaccio.yml & sleep 10
yarn config set registry "http://localhost:4873"
npm config set registry "http://localhost:4873"
yarn lerna publish \
  --force-publish=* \
  --skip-git \
  --skip-npm \
  --registry http://localhost:4873/ \
  --yes \
  --cd-version patch
yarn lerna exec yarn publish --registry http://localhost:4873/
yarn test:create-project
