const { Neutrino, inspect } = require('../src');
const { defaultTo } = require('ramda');
const merge = require('deepmerge');

const envs = {
  build: 'production',
  start: 'development',
  test: 'test'
};

module.exports = (middleware, args) => {
  const options = merge({
    args,
    debug: args.debug,
    env: {
      NODE_ENV: defaultTo('development', envs[args._[0]])
    }
  }, args.options);
  const api = Neutrino(options);

  return api
    .run('inspect', middleware, inspect)
    .fork((err) => {
      console.error(err);
      process.exit(1);
    }, console.log);
};
