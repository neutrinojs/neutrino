const {
  cond, curry, identity, of, T
} = require('ramda');
const { List } = require('immutable-ext');
const { isAbsolute, join } = require('path');

// createPaths :: (String -> String) -> List String
const createPaths = curry((root, moduleId) => List.of(
  join(root, moduleId),
  join(root, 'node_modules', moduleId),
  moduleId
));

// normalize :: String base -> String path -> String
const normalizePath = curry((base, path) => (isAbsolute(path) ? path : join(base, path)));

// toArray :: a -> Array
const toArray = cond([
  [Array.isArray, identity],
  [T, of]
]);

// req :: String moduleId -> a
const req = (moduleId, root) => {
  const paths = createPaths(root, moduleId);
  const path = paths.find((path) => {
    try {
      require.resolve(path);
      return true;
    } catch (err) {
      return path === paths.last();
    }
  });

  return require(path); // eslint-disable-line
};

module.exports = {
  createPaths,
  normalizePath,
  toArray,
  req
};
