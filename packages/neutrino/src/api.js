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
  const root = normalizePath(process.cwd(), defaultTo('', options.root));
  const base = normalizePath(root);
  const source = base(defaultTo('src', options.source));
  const output = base(defaultTo('build', options.output));
  const tests = base(defaultTo('test', options.tests));
  const node_modules = base(defaultTo('node_modules', options.node_modules)); // eslint-disable-line camelcase
  const entry = normalizePath(source, defaultTo('index.js', options.entry));

  return merge(options, { root, source, output, tests, node_modules, entry });
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
