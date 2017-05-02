const { start } = require('../src');
const ora = require('ora');

module.exports = (middleware, options) => {
  const spinner = ora('Building project').start();

  return start(middleware, options)
    .fork((errors) => {
      spinner.fail('Building project failed');
      errors.forEach(err => console.error(err));
      process.exit(1);
    }, (compiler) => { // eslint-disable-line consistent-return
      if (!compiler.options.devServer) {
        return spinner.succeed('Build completed');
      }

      const { devServer } = compiler.options;
      const protocol = devServer.https ? 'https' : 'http';
      const { host, port } = devServer;

      spinner.succeed(`Development server running on: ${protocol}://${host}:${port}`);

      const building = ora('Waiting for initial build to finish').start();

      compiler.plugin('done', () => building.succeed('Build completed'));
      compiler.plugin('compile', () => {
        building.text = 'Source changed, re-compiling';
        building.start();
      });
    });
};
