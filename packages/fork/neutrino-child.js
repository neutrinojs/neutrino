const {
  cond, equals, identity, is, objOf, of, pipe, T
} = require('ramda');
const build = require('neutrino/bin/build');
const execute = require('neutrino/bin/execute');
const inspect = require('neutrino/bin/inspect');
const start = require('neutrino/bin/start');
const test = require('neutrino/bin/test');

const timeout = setTimeout(Function.prototype, 10000);
const normalizeMiddleware = cond([
  [is(Object), identity],
  [T, pipe(of, objOf('use'))]
]);
const runnable = (command, middleware, args) => cond([
  [equals('build'), () => build(middleware, args)],
  [equals('start'), () => start(middleware, args)],
  [equals('test'), () => test(middleware, args)],
  [equals('inspect'), () => inspect(middleware, args)],
  [T, () => execute(middleware, args)]
])(command);

process.on('message', (payload) => {
  const [rawMiddleware, args] = eval(`(${payload})`); // eslint-disable-line no-eval

  process.on('unhandledRejection', (err) => {
    if (!args.quiet) {
      console.error('');
      console.error(err);
    }

    process.exit(1);
  });

  clearTimeout(timeout);

  const middleware = normalizeMiddleware(rawMiddleware);
  const command = args.inspect ? 'inspect' : args._[0];

  // Merge CLI config options as last piece of middleware, e.g. options.config.devServer.port 4000
  if (args.options) {
    middleware.use.push(({ config }) => config.merge(args.options.config));
  }

  const api = runnable(command, [middleware], args);

  api.on('*', (type, ...args) => {
    process.send([type, args]);
  });
});
