const { test } = require('../src');

module.exports = (middleware, options) => test(middleware, options)
  .fork((err) => {
    console.error(err.stack || err);
    process.exit(1);
  }, Function.prototype);
