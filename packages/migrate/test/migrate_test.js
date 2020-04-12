const { readFileSync } = require('fs');
const { resolve } = require('path');
const { defineSnapshotTest } = require('jscodeshift/src/testUtils');

const fixture = readFileSync(
  resolve(__dirname, 'fixtures/.neutrinorc.js'),
  'utf8',
);
const transform = require('../transforms/middleware.js');

defineSnapshotTest(transform, {}, fixture, 'performs valid transformation');
