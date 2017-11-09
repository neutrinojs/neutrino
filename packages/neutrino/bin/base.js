const merge = require('deepmerge');
const { Neutrino } = require('../src');

module.exports = ({
  middleware,
  args,
  NODE_ENV,
  apiCommand = args._[0],
  commandName = args._[0],
  commandHandler,
  errorsHandler,
  successHandler
}) => {
  const options = merge({
    args,
    command: apiCommand,
    debug: args.debug,
    quiet: args.quiet,
    env: { NODE_ENV }
  }, args.options);
  const api = Neutrino(options);

  api.register(commandName, commandHandler);

  return api
    .run(commandName, middleware)
    .fork(
      (errs) => {
        const errors = Array.isArray(errs) ? errs : [errs];

        if (errorsHandler) {
          errorsHandler(errors);
        }

        if (!args.quiet) {
          errors.forEach((err) => {
            if (!err) {
              return;
            }

            if (err.message && err.message.includes('No entry points found')) {
              console.error([
                'No entry points were found.',
                'Ensure that all intended middleware or presets are being used',
                'and at least one entry point is defined.',
                'You can inspect the final configuration with --inspect.'
              ].join(' '));
            } else {
              console.error(err);
            }
          });
        }

        process.exit(1);
      },
      successHandler
    );
};
