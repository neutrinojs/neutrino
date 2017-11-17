const { test } = require('../src');
const base = require('./base');

module.exports = (middleware, args) => base({
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
