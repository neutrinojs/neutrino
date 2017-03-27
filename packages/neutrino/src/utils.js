const Future = require('fluture');
const { cond, curry, defaultTo, identity, map, memoize, of, partialRight, pipe, reduce, T } = require('ramda');
const { List } = require('immutable-ext');
const { isAbsolute, join } = require('path');
const optional = require('optional');

// any :: List -> Future a b
const any = reduce(Future.or, Future.reject('empty list'));

// createPaths :: (String -> String) -> List String
const createPaths = curry((base, middleware) => List.of(
  join(base, middleware),
  join(base, 'node_modules', middleware),
  middleware
));

// getNodeEnv :: String command -> String? env -> String
const getNodeEnv = (command = 'start', env) => defaultTo({
  build: 'production',
  start: 'development',
  test: 'test'
}[command] || 'development', env);

// getPackageJson :: () -> Object
const getPackageJson = memoize(pipe(
  process.cwd,
  partialRight(join, ['package.json']),
  optional,
  defaultTo({})
));

// normalize :: String base -> String path -> String
const normalizePath = curry((base, path) => (isAbsolute(path) ? path : join(base, path)));

// resolveSafe :: String -> Future Error String
const resolveSafe = Future.encase(require.resolve);

// requireSafe :: String -> Future Error a
const requireSafe = Future.encase(require);

// resolveAny :: List -> Future Error String
const resolveAny = pipe(map(resolveSafe), any);

// toArray :: a -> Array
const toArray = cond([
  [Array.isArray, identity],
  [T, of]
]);

module.exports = {
  any,
  createPaths,
  getNodeEnv,
  getPackageJson,
  normalizePath,
  requireSafe,
  resolveAny,
  resolveSafe,
  toArray
};
