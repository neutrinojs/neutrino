const { test } = require('../src');

module.exports = (middleware, options) => test(middleware, options)
  .fork((err) => {
    console.error(err);
    process.exit(1);
  }, () => {
    // Some test runners do not cleanly exit after resolving their promise.
    // Force exit once we get here.
    process.exit(0);
  });
