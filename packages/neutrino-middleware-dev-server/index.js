const ramda = require('ramda');
const hot = require('neutrino-middleware-hot');
const open = require('opn');
const dns = require('dns');
const os = require('os');

module.exports = (neutrino, options = {}) => {
  neutrino.use(hot);

  const config = neutrino.config;
  const server = ramda.pathOr({}, ['options', 'config', 'devServer'], neutrino);
  const protocol = process.env.HTTPS ? 'https' : 'http';
  const host = process.env.HOST || server.host || options.host || '0.0.0.0';
  const port = process.env.PORT || server.port || options.port || 5000;
  const https = (protocol === 'https') || server.https || options.https;

  config.devServer
    .host(String(host))
    .port(Number(port))
    .https(Boolean(https))
    .contentBase(neutrino.options.source)
    .historyApiFallback(true)
    .hot(true)
    .headers({
      host
    })
    .publicPath('/')
    .stats({
      assets: false,
      children: false,
      chunks: false,
      colors: true,
      errors: true,
      errorDetails: true,
      hash: false,
      modules: false,
      publicPath: false,
      timings: false,
      version: false,
      warnings: true
    });

  config.entry('index')
    .add(`${require.resolve('webpack-dev-server/client')}?${protocol}://${host}:${port}/`)
    .add(require.resolve('webpack/hot/dev-server'));
};
