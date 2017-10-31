const { defaultTo } = require('ramda');
const { inspect } = require('../src');
const base = require('./base');

const envs = {
  build: 'production',
  start: 'development',
  test: 'test'
};

module.exports = (middleware, args) => base({
  middleware,
  args,
  NODE_ENV: defaultTo('development', envs[args._[0]]),
  commandHandler: inspect,
  commandName: 'inspect',
  successHandler(output) {
    if (!args.quiet) {
      console.log(output);
    }
  }
});
