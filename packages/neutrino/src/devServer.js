const merge = require('deepmerge');
const webpack = require('webpack');
const DevServer = require('webpack-dev-server');
const Future = require('fluture');

// devServer :: Object webpackConfig -> Future () Function
const devServer = webpackConfig => new Future((reject, resolve) => {
  const config = merge({
    devServer: { host: 'localhost', port: 5000, noInfo: true }
  }, webpackConfig);
  const { host, port } = config.devServer;

  const compiler = webpack(config);
  const server = new DevServer(compiler, config.devServer);

  server.listen(port, host, () => resolve(compiler));
});

module.exports = devServer;
