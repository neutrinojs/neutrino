const { Neutrino } = require('../src');
const merge = require('deepmerge');
const ora = require('ora');

module.exports = (middleware, args) => {
  const commandName = args._[0];
  const spinner = ora(`Running ${commandName}`).start();
  const options = merge({
    args,
    debug: args.debug,
    env: {
      NODE_ENV: 'production'
    }
  }, args.options);
  const api = Neutrino(options);

  return api
    .run(commandName, middleware, config => api.commands[commandName](config))
    .fork((errors) => {
      spinner.fail(`Running ${commandName} failed`);
      errors.forEach(err => console.error(err));
      process.exit(1);
    }, (output) => {
      spinner.succeed(`Running ${commandName} completed`);
      console.log(output);
    });
};
