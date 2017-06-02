const { cond, curry, identity, of, T } = require('ramda');
const { List } = require('immutable-ext');
const { isAbsolute, join } = require('path');

// createPaths :: (String -> String) -> List String
const createPaths = curry((base, middleware) => List.of(
  join(base, middleware),
  join(base, 'node_modules', middleware),
  middleware
));

// normalize :: String base -> String path -> String
const normalizePath = curry((base, path) => (isAbsolute(path) ? path : join(base, path)));

// toArray :: a -> Array
const toArray = cond([
  [Array.isArray, identity],
  [T, of]
]);

module.exports = {
  createPaths,
  normalizePath,
  toArray
};
