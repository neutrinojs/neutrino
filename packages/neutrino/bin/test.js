const { Neutrino, test } = require('../src');
const merge = require('deepmerge');

module.exports = (middleware, args) => {
  const options = merge({
    args,
    debug: args.debug,
    env: {
      NODE_ENV: 'test'
    }
  }, args.options);
  const api = Neutrino(options);

  return api
    .run('test', middleware, test)
    .fork((err) => {
      console.error(err);
      process.exit(1);
    }, () => {
      // Some test runners do not cleanly exit after resolving their promise.
      // Force exit once we get here.
      process.exit(0);
    });
};
