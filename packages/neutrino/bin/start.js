const { Neutrino, start } = require('../src');
const merge = require('deepmerge');
const ora = require('ora');

module.exports = (middleware, args) => {
  const spinner = args.quiet ? null : ora('Building project').start();
  const options = merge({
    args,
    debug: args.debug,
    quiet: args.quiet,
    env: {
      NODE_ENV: 'development'
    }
  }, args.options);
  const api = Neutrino(options);

  api.register('start', start);

  return api
    .run('start', middleware)
    .fork((errors) => {
      if (!args.quiet) {
        spinner.fail('Building project failed');
        errors.forEach(err => console.error(err));
      }

      process.exit(1);
    }, (compiler) => {
      if (args.quiet) {
        return;
      }

      if (!compiler.options.devServer) {
        spinner.succeed('Build completed');
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
    });
};
