const Config = require('webpack-chain');
const merge = require('deepmerge');
const { List } = require('immutable-ext');
const Future = require('fluture');
const mitt = require('mitt');
const { chain, defaultTo, pipe } = require('ramda');
const { createPaths, normalizePath, resolveAny, requireSafe } = require('./utils');
const build = require('./build');
const inspect = require('./inspect');
const start = require('./start');
const test = require('./test');

const getOptions = (options = {}) => {
  let root = defaultTo('', options.root);
  let source = defaultTo('src', options.source);
  let output = defaultTo('build', options.output);
  let tests = defaultTo('test', options.tests);
  let node_modules = defaultTo('node_modules', options.node_modules); // eslint-disable-line camelcase
  let entry = defaultTo('index', options.entry);

  Object.defineProperties(options, {
    root: {
      get() {
        return normalizePath(process.cwd(), root);
      },
      set(value) {
        root = defaultTo('', value);
      }
    },
    source: {
      get() {
        return normalizePath(this.root, source);
      },
      set(value) {
        source = defaultTo('src', value);
      }
    },
    output: {
      get() {
        return normalizePath(this.root, output);
      },
      set(value) {
        output = defaultTo('build', value);
      }
    },
    tests: {
      get() {
        return normalizePath(this.root, tests);
      },
      set(value) {
        tests = defaultTo('test', value);
      }
    },
    node_modules: {
      get() {
        return normalizePath(this.root, node_modules);
      },
      set(value) {
        node_modules = defaultTo('node_modules', value); // eslint-disable-line camelcase
      }
    },
    entry: {
      get() {
        return normalizePath(this.source, entry);
      },
      set(value) {
        entry = defaultTo('index', value);
      }
    }
  });

  return options;
};

// Api :: () -> Object
const Api = pipe(getOptions, (options) => {
  const listeners = {};

  const api = merge(mitt(listeners), {
    listeners,
    options,
    commands: {},
    config: new Config(),

    // emitForAll :: String -> payload -> Promise
    emitForAll: (eventName, payload) => Promise
      .all((api.listeners[eventName] || []).map(f => f(payload))),

    // register :: String command -> Future handler -> ()
    register: (command, handler) => api.commands[command] = handler,

    // run :: String command -> Future Error a
    run: command => api.commands[command](api.config.toConfig()),

    // requires :: (Array String middleware) -> Future Error (List a)
    requires: middleware => List(middleware).map(pipe(
      createPaths(api.options.root),
      resolveAny,
      chain(requireSafe)
    )),

    // requiresAndUses :: Future Error a -> Future Error a
    requiresAndUses: middleware => api.useRequires(api.requires(middleware)),

    // use :: Function middleware -> Object options -> IO ()
    use: (middleware, options = {}) => middleware(api, options),

    // useRequires :: Future Error (List a) -> Future Error (List a)
    useRequires: requires => requires
      // For all middleware, pass it to api.use()
      .map(chain(Future.encase(api.use)))
      // Fold the middleware down to a single Task/Future status
      .reduce((f, current) => f.chain(() => current), Future.of())
  });

  api.register('build', build);
  api.register('inspect', inspect);
  api.register('start', start);
  api.register('test', test);

  return api;
});

module.exports = Api;
