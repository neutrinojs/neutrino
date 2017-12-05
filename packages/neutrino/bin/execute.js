const ora = require('ora');
const base = require('./base');

module.exports = (middleware, args, cli) => {
  const commandName = args._[0];
  const spinner = ora({ text: `Running ${commandName}` });

  return base({
    cli,
    middleware,
    args,
    NODE_ENV: 'production',
    commandName: `${commandName}-cli`,
    commandHandler(config, neutrino) {
      if (!args.quiet) {
        spinner.enabled = global.interactive;
        spinner.start();
      }

      const command = neutrino.commands[commandName];

      if (!command) {
        throw new Error(`A command with the name "${commandName}" was not registered`);
      }

      return command(config, neutrino);
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
