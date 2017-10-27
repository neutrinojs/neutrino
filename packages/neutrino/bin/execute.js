const { Neutrino } = require('../src');
const merge = require('deepmerge');
const ora = require('ora');

const timeout = setTimeout(Function.prototype, 10000);

process.on('message', ([middleware, args]) => {
  clearTimeout(timeout);

  const commandName = args._[0];
  const spinner = args.quiet ? null : ora(`Running ${commandName}`).start();
  const options = merge({
    args,
    command: commandName,
    debug: args.debug,
    quiet: args.quiet,
    env: {
      NODE_ENV: 'production'
    }
  }, args.options);
  const api = Neutrino(options);

  return api
    .register(`${commandName}-cli`, (config, api) => api.commands[commandName](config, api))
    .use(middleware)
    .run(`${commandName}-cli`)
    .fork((errors) => {
      if (!args.quiet) {
        spinner.fail(`Running ${commandName} failed`);
        errors.forEach(err => console.error(err));
      }

      process.exit(1);
    }, (output) => {
      if (!args.quiet) {
        spinner.succeed(`Running ${commandName} completed`);

        if (output) {
          console.log(output);
        }
      }

      process.exit(0);
    });
});
