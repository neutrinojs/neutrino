const ora = require('ora');
const merge = require('deepmerge');
const webpack = require('webpack');
const DevServer = require('webpack-dev-server');

module.exports = _config => new Promise((resolve) => {
  const defaultDevServer = { host: 'localhost', port: 5000, noInfo: true };
  const config = merge({ devServer: defaultDevServer }, _config);
  const protocol = config.devServer.https ? 'https' : 'http';
  const { host, port } = config.devServer;

  const starting = ora('Starting development server').start();
  const compiler = webpack(config);
  const server = new DevServer(compiler, config.devServer);
  const building = ora('Waiting for initial build to finish').start();

  server.listen(port, host, () => {
    starting.succeed(`Development server running on: ${protocol}://${host}:${port}`);

    compiler.plugin('done', () => building.succeed('Build completed'));
    compiler.plugin('compile', () => {
      building.text = 'Source changed, re-compiling';
      building.start();
    });
  });

  process.on('SIGINT', resolve);
});
