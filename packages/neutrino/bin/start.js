const { start } = require('../src');
const ora = require('ora');
const { lookup } = require('dns');
const { hostname } = require('os');
const Future = require('fluture');

const whenIpReady = Future.node((done) => {
  const host = hostname();
  lookup(host, done);
});

whenIpReady.then(ip => process.env.HOST = process.env.HOST || ip);

module.exports = (middleware, options) => {
  const spinner = ora('Building project').start();

  return whenIpReady.then(ip => start(middleware, options).fork(
      (errors) => {
        spinner.fail('Building project failed');
        errors.forEach(err => console.error(err));
        process.exit(1);
      },
      (compiler) => {
        if (!compiler.options.devServer) {
          return spinner.succeed('Build completed');
        }

        const { devServer } = compiler.options;
        const protocol = devServer.https ? 'https' : 'http';
        const { port } = devServer;
        let { host } = devServer;

        if (host === '0.0.0.0') {
          host = ip;
        }

        spinner.succeed(`Development server running on: ${protocol}://${host}:${port}`);

        const building = ora('Waiting for initial build to finish').start();

        compiler.plugin('done', () => building.succeed('Build completed'));
        compiler.plugin('compile', () => {
          building.text = 'Source changed, re-compiling';
          building.start();
        });
        return undefined;
      }
    ));
};
