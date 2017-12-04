const ora = require('ora');
const debounce = require('lodash.debounce');
const { start } = require('../src');
const base = require('./base');

module.exports = (middleware, args) => {
  const spinner = ora({ text: 'Building project' });

  return base({
    middleware,
    args,
    NODE_ENV: 'development',
    commandHandler(config, neutrino) {
      if (!args.start) {
        spinner.enabled = global.interactive;
        spinner.start();
      }

      return start(config, neutrino);
    },
    errorsHandler() {
      spinner.fail('Building project failed');
    },
    successHandler(compiler) {
      if (args.quiet || !compiler) {
        return;
      }

      if (!compiler.options.devServer) {
        spinner.succeed('Build completed');

        const building = ora({
          text: 'Performing initial build',
          enabled: global.interactive
        });

        compiler.plugin('done', () => {
          building.succeed('Build completed');
        });
        compiler.plugin('compile', () => {
          building.text = 'Source changed, re-compiling';
          building.start();
        });
      } else {
        const { devServer } = compiler.options;
        const url = `${devServer.https ? 'https' : 'http'}://${devServer.public}`;
        const building = ora({
          text: 'Waiting for initial build to finish',
          enabled: global.interactive
        });

        spinner.succeed(`Development server running on: ${url}`);
        building.start();
        compiler.plugin('done', () => {
          building.succeed('Build completed');
        });

        // We debounce the "compile" event due to the devServer emitting
        // many events with over emitted file saves. Typically this would
        // cause the terminal to become filled with "re-comiling" messages,
        // But debouncing this limits the message to a rolling 1-second
        // interval to capture related compile events, improving the
        // terminal message usefulness.
        compiler.plugin('compile', debounce(() => {
          building.text = 'Source changed, re-compiling';
          building.start();
        }, 1000, { leading: true, maxWait: 1000 }));
      }
    }
  });
};
