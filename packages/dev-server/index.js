const open = require('opn');
const merge = require('deepmerge');

const isLocal = host => host === 'localhost' || host === '127.0.0.1';
const getHost = publicHost => (isLocal(publicHost) ? 'localhost' : '0.0.0.0');
const getPort = (neutrino, opts) => neutrino.options.port || opts.port || 5000;
const getPublic = (neutrino, options) => {
  const port = getPort(neutrino, options);

  if (options.public) {
    const normalizedPath = options.public.split(':');

    return normalizedPath.length === 2 ?
      options.public :
      `${normalizedPath[0]}:${port}`;
  }

  if (neutrino.options.host) {
    return isLocal(neutrino.options.host) ? 'localhost' : neutrino.options.host;
  }

  return !options.host || isLocal(options.host) ?
    `localhost:${port}` :
    `${options.host}:${port}`;
};

module.exports = (neutrino, opts = {}) => {
  const port = getPort(neutrino, opts);
  const publicHost = getPublic(neutrino, opts);
  const host = getHost(publicHost);

  const options = merge.all([
    {
      port,
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
      .when(options.open, () => {
        neutrino.on('start', () => open(url, { wait: false }));
      });
};
