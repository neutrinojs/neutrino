const ora = require('ora');
const { start } = require('../src');
const base = require('./base');

module.exports = (middleware, args) => {
  const spinner = args.quiet ? null : ora('Building project').start();

  return base({
    middleware,
    args,
    NODE_ENV: 'development',
    commandHandler: start,
    errorsHandler() {
      spinner.fail('Building project failed');
    },
    successHandler(compiler) {
      if (args.quiet) {
        return;
      }

      if (!compiler.options.devServer) {
        spinner.succeed('Build completed');
        const building = ora('Performing initial build');

        compiler.plugin('done', () => building.succeed('Build completed'));
        compiler.plugin('compile', () => {
          building.text = 'Source changed, re-compiling';
          building.start();
        });
      } else {
        const { devServer } = compiler.options;
        const url = `${devServer.https ? 'https' : 'http'}://${devServer.public}:${devServer.port}`;
        const building = ora('Waiting for initial build to finish');

        spinner.succeed(`Development server running on: ${url}`);
        building.start();
        compiler.plugin('done', () => building.succeed('Build completed'));
        compiler.plugin('compile', () => {
          building.text = 'Source changed, re-compiling';
          building.start();
        });
      }
    }
  });
};
