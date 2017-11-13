const ora = require('ora');
const base = require('./base');

module.exports = (middleware, args) => {
  const commandName = args._[0];
  const spinner = args.quiet ? null : ora(`Running ${commandName}`).start();

  return base({
    middleware,
    args,
    NODE_ENV: 'production',
    commandName: `${commandName}-cli`,
    commandHandler(config, api) {
      const command = api.commands[commandName];

      if (!command) {
        throw new Error(`A command with the name "${commandName}" was not registered`);
      }

      return command(config, api);
    },
    errorsHandler() {
      if (!args.quiet) {
        spinner.fail(`Running ${commandName} failed`);
      }
    },
    successHandler(output) {
      if (!args.quiet) {
        spinner.succeed(`Running ${commandName} completed`);

        if (output != null) {
          console.log(output);
        }
      }
    }
  });
};
