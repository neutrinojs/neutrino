const Future = require('fluture');
const stringify = require('javascript-stringify');
const sort = require('deep-sort-object');
const { partialRight, pipe } = require('ramda');

// inspect :: Object config -> Future () String
const inspect = pipe(sort, partialRight(stringify, [null, 2]), Future.of);

module.exports = inspect;
