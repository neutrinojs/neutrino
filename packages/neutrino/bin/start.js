const ora = require('ora');
const { start } = require('../src');
const base = require('./base');

module.exports = (middleware, args, cli) => {
  const spinner = ora({ text: 'Building project' });

  return base({
    cli,
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
        compiler.plugin('compile', () => {
          building.text = 'Source changed, re-compiling';
          building.start();
        });
      }
    }
  });
};
