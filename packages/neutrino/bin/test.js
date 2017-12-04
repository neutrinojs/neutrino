const { test } = require('../src');
const base = require('./base');

module.exports = (middleware, args, cli) => base({
  cli,
  middleware,
  args,
  NODE_ENV: 'test',
  commandHandler: test,
  successHandler() {
    // Some test runners do not cleanly exit after resolving their promise.
    // Force exit once we get here.
    process.exit(0);
  }
});
