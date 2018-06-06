const { defaultTo } = require('ramda');
const { inspect, inspectNew } = require('../src');
const base = require('./base');

const envs = {
  build: 'production',
  start: 'development',
  test: 'test'
};

module.exports = (middleware, args, cli) => base({
  cli,
  middleware,
  args,
  NODE_ENV: defaultTo('development', envs[args._[0]]),
  commandHandler: args.inspectNew ? inspectNew : inspect,
  commandName: 'inspect',
  successHandler(output) {
    if (!args.quiet && output) {
      console.log(output);
    }
  }
});
