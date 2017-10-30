const { Neutrino, inspect } = require('../src');
const { defaultTo } = require('ramda');
const merge = require('deepmerge');

const envs = {
  build: 'production',
  start: 'development',
  test: 'test'
};
const timeout = setTimeout(Function.prototype, 10000);

process.on('message', ([middleware, args]) => {
  clearTimeout(timeout);

  const commandName = args._[0];
  const options = merge({
    args,
    command: commandName,
    debug: args.debug,
    quiet: args.quiet,
    env: {
      NODE_ENV: defaultTo('development', envs[commandName])
    }
  }, args.options);
  const api = Neutrino(options);

  return api
    .register('inspect', inspect)
    .use(middleware)
    .run('inspect')
    .fork((err) => {
      if (!args.quiet) {
        console.error(err);
      }

      process.exit(1);
    }, console.log);
});
