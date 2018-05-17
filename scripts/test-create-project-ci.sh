#! /usr/bin/env bash

yarn verdaccio --config verdaccio.yml & sleep 10;
yarn config set registry "http://localhost:4873";
npm config set registry "http://localhost:4873";
scripts/npm-adduser.js;
yarn lerna publish \
  --force-publish=* \
  --skip-git \
  --skip-npm \
  --registry http://localhost:4873/ \
  --yes \
  --repo-version $(node_modules/.bin/semver -i patch $(npm view neutrino version));
yarn lerna exec npm publish --registry http://localhost:4873/;
yarn test:create-project;