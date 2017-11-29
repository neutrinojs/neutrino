const {
  cond, curry, identity, of, prop, T
} = require('ramda');
const { List } = require('immutable-ext');
const { isAbsolute, join } = require('path');

// createPaths :: (String -> String) -> List String
const createPaths = curry((root, moduleId) => List.of(
  join(root, moduleId),
  join(root, 'node_modules', moduleId),
  moduleId
));

// exists :: (String -> String) -> Boolean
const exists = (root, module) => {
  try {
    require.resolve(join(root, module));
    return true;
  } catch (err) {
    return false;
  }
};

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

// getRoot :: Object -> String
const getRoot = prop('root');

// getSource :: Object -> String
const getSource = prop('source');

// [PATH_PROP_NAME, DEFAULT_VALUE, GET_NORMALIZE_BASE]
const pathOptions = [
  ['root', '', () => process.cwd()],
  ['source', 'src', getRoot],
  ['output', 'build', getRoot],
  ['tests', 'test', getRoot],
  ['node_modules', 'node_modules', getRoot]
];

module.exports = {
  createPaths,
  exists,
  normalizePath,
  toArray,
  req,
  getRoot,
  getSource,
  pathOptions
};
