const Config = require('webpack-chain');
const merge = require('deepmerge');
const Future = require('fluture');
const mitt = require('mitt');
const { cond, defaultTo, is, map, omit, pipe, prop } = require('ramda');
const { createPaths, normalizePath, toArray } = require('./utils');

// getRoot :: Object -> a
const getRoot = prop('root');

// [PATH_PROP_NAME, DEFAULT_VALUE, GET_NORMALIZE_BASE]
const pathOptions = [
  ['root', '', () => process.cwd()],
  ['source', 'src', getRoot],
  ['output', 'build', getRoot],
  ['tests', 'test', getRoot],
  ['node_modules', 'node_modules', getRoot],
  ['entry', 'index', prop('source')]
];

// getOptions :: Object? -> IO Object
const getOptions = (opts = {}) => {
  const options = merge({
    env: {
      NODE_ENV: 'development'
    },
    debug: false
  }, opts);

  Object
    .keys(options.env)
    .forEach(env => process.env[env] = options.env[env]);

  pathOptions.forEach(([path, defaultValue, getNormalizeBase]) => {
    let value = defaultTo(defaultValue, options[path]);

    Object.defineProperty(options, path, {
      enumerable: true,
      get() {
        return normalizePath(getNormalizeBase(options), value);
      },
      set(newValue) {
        value = defaultTo(defaultValue, newValue);
      }
    });
  });

  return options;
};

// Api :: Object? -> Object
const Api = pipe(getOptions, (options) => {
  const listeners = {};
  const api = merge(mitt(listeners), {
    listeners,
    options,
    config: new Config(),

    // emitForAll :: String -> payload -> Promise
    emitForAll: (eventName, payload) => Promise
      .all((api.listeners[eventName] || []).map(f => f(payload))),

    // require :: String moduleId -> a
    require: (moduleId) => {
      const paths = createPaths(api.options.root, moduleId);
      const path = paths.find((path) => {
        try {
          require.resolve(path);
          return true;
        } catch (err) {
          return path === paths.last();
        }
      });

      return require(path); // eslint-disable-line
    },

    // use :: Function middleware -> Object options -> IO ()
    use: (middleware, options) => cond([
      // If middleware is a function, invoke it with the provided options
      [is(Function), () => middleware(api, options)],

      // If middleware is a string, it's a module to require. Require it, then run the results back
      // through .use() with the provided options
      [is(String), () => api.use(api.require(middleware), options)],

      // If middleware is an array, it's a pair of some other middleware type and options
      [is(Array), () => api.use(...middleware)],

      // If middleware is an object, it could contain other middleware in its "use" property.
      // Run every item in "use" prop back through .use(), plus set any options.
      // The value of "env" will also be consumed as middleware, which will potentially load more middleware and
      // options
      [is(Object), () => {
        if (middleware.options) {
          api.options = getOptions(merge(api.options, middleware.options));
        }

        if (middleware.env) {
          const envMiddleware = Object
            .keys(middleware.env)
            .map((key) => {
              const envValue = api.options.env[key];
              const env = middleware.env[key][envValue];

              if (env && env.options) {
                api.options = getOptions(merge(api.options, env.options));
              }

              if (env) {
                return omit(['options'], env);
              }

              return null;
            });

          if (middleware.use) {
            map(api.use, middleware.use);
          }

          map(api.use, envMiddleware.filter(Boolean));
        } else if (middleware.use) {
          map(api.use, middleware.use);
        }
      }]
    ])(middleware),

    run: (name, middleware, handler) => Future
      // Require and use all middleware
      .try(() => map(api.use, middleware))
      // Trigger all pre-events for the current command
      .chain(() => Future.fromPromise2(api.emitForAll, `pre${name}`, api.options.args))
      // Trigger generic pre-event
      .chain(() => Future.fromPromise2(api.emitForAll, 'prerun', api.options.args))
      // Execute the command
      .chain(() => handler(api.config.toConfig()))
      // Trigger all post-command events, resolving with the value of the command execution
      .chain(value => Future
        .fromPromise2(api.emitForAll, name, api.options.args)
        .chain(() => Future.of(value)))
      // Trigger generic post-event, resolving with the value of the command execution
      .chain(value => Future
        .fromPromise2(api.emitForAll, 'run', api.options.args)
        .chain(() => Future.of(value)))
      .mapRej(toArray)
  });

  return api;
});

module.exports = Api;
