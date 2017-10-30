const { Neutrino, test } = require('../src');
const merge = require('deepmerge');

const timeout = setTimeout(Function.prototype, 10000);

process.on('message', ([middleware, args]) => {
  clearTimeout(timeout);

  const options = merge({
    args,
    command: args._[0],
    debug: args.debug,
    quiet: args.quiet,
    env: {
      NODE_ENV: 'test'
    }
  }, args.options);
  const api = Neutrino(options);

  return api
    .register('test', test)
    .use(middleware)
    .run('test')
    .fork((err) => {
      if (err) {
        Array.isArray(err) ? err.forEach(err => err && console.error(err)) : console.error(err);
      }

      process.exit(1);
    }, () => {
      // Some test runners do not cleanly exit after resolving their promise.
      // Force exit once we get here.
      process.exit(0);
    });
});
