const open = require('opn');
const merge = require('deepmerge');

const isLocal = host => host === 'localhost' || host === '127.0.0.1';
const getHost = publicHost => (isLocal(publicHost) ? 'localhost' : '0.0.0.0');
const getPublic = (neutrino, options) => {
  if (options.public) {
    return options.public;
  }

  if (neutrino.options.host) {
    return isLocal(neutrino.options.host) ? 'localhost' : neutrino.options.host;
  }

  return !options.host || isLocal(options.host) ?
    'localhost' :
    options.host;
};


module.exports = (neutrino, opts = {}) => {
  const publicHost = getPublic(neutrino, opts);
  const host = getHost(publicHost);
  const options = merge.all([
    {
      port: 5000,
      https: false,
      contentBase: neutrino.options.source,
      open: false,
      hot: true,
      historyApiFallback: true,
      publicPath: '/',
      headers: {
        host: publicHost
      },
      stats: {
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
      }
    },
    opts,
    { host, public: publicHost },
    neutrino.options.port ? { port: neutrino.options.port } : {},
    neutrino.options.https ? { https: neutrino.options.https } : {}
  ]);
  const protocol = options.https ? 'https' : 'http';
  const url = `${protocol}://${publicHost}:${options.port}`;

  neutrino.config
    .devServer
      .merge(options)
      .end()
    .when(options.open, () => neutrino.on('start', () => open(url, { wait: false })))
    .entry('index')
      .when(options.hot, entry => entry.prepend(require.resolve('webpack/hot/dev-server')))
      .prepend(`${require.resolve('webpack-dev-server/client')}?${url}`);
};
