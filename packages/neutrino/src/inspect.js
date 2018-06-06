const Future = require('fluture');
const stringify = require('javascript-stringify');
const sort = require('deep-sort-object');
const { partialRight, pipe } = require('ramda');
const { toString } = require('webpack-chain');

// inspect :: Object config -> Future () String
const inspect = pipe(sort, partialRight(stringify, [null, 2]), Future.of);

const configPrefix = 'neutrino.config';

// Uses the new webpack-chain 4.8.0+ toString() support to generate more helpful output.
// This output style will be the default in Neutrino 9+.
const inspectNew = config => Future.of(toString(config, { configPrefix }));

module.exports = { inspect, inspectNew };
