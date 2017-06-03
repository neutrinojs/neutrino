const { Neutrino, start } = require('../src');
const merge = require('deepmerge');
const ora = require('ora');
const { lookup } = require('dns');
const { hostname } = require('os');
const Future = require('fluture');

const whenIpReady = Future.node(done => lookup(hostname(), done));

module.exports = (middleware, args) => {
  const spinner = ora('Building project').start();
  const options = merge({
    args,
    debug: args.debug,
    env: {
      NODE_ENV: 'development'
    }
  }, args.options);
  const api = Neutrino(options);

  return api
    .run('start', middleware, start)
    .fork((errors) => {
      spinner.fail('Building project failed');
      errors.forEach(err => console.error(err));
      process.exit(1);
    }, (compiler) => {
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
