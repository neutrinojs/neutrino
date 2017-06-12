const { Neutrino } = require('../src');
const merge = require('deepmerge');
const ora = require('ora');

module.exports = (middleware, args) => {
  const commandName = args._[0];
  const spinner = args.quiet ? null : ora(`Running ${commandName}`).start();
  const options = merge({
    args,
    debug: args.debug,
    quiet: args.quiet,
    env: {
      NODE_ENV: 'production'
    }
  }, args.options);
  const api = Neutrino(options);

  api.register(`${commandName}-cli`, (config, api) => api.commands[commandName](config, api));

  return api
    .run(`${commandName}-cli`, middleware)
    .fork((errors) => {
      if (!args.quiet) {
        spinner.fail(`Running ${commandName} failed`);
        errors.forEach(err => console.error(err));
      }

      process.exit(1);
    }, (output) => {
      if (!args.quiet) {
        spinner.succeed(`Running ${commandName} completed`);
        console.log(output);
      }
    });
};
