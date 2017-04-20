const { inspect } = require('../src');

module.exports = (middleware, options) => inspect(middleware, options)
  .fork((err) => {
    console.error(err);
    process.exit(1);
  }, console.log);
