const { Neutrino, test } = require('../src');
const merge = require('deepmerge');

module.exports = (middleware, args) => {
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

  api.register('test', test);

  return api
    .run('test', middleware)
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
};
