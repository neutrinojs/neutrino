const merge = require('deepmerge');

const isLocal = host => host === 'localhost' || host === '127.0.0.1';
const getHost = publicHost => (isLocal(publicHost) ? 'localhost' : '0.0.0.0');
const getPort = opts => opts.port || 5000;
const getPublic = options => {
  const port = getPort(options);

  if (options.public) {
    const normalizedPath = options.public.split(':');

    return normalizedPath.length === 2
      ? options.public
      : `${normalizedPath[0]}:${port}`;
  }

  return !options.host || isLocal(options.host)
    ? `localhost:${port}`
    : `${options.host}:${port}`;
};

module.exports = (neutrino, opts = {}) => {
  const port = getPort(opts);
  const publicHost = getPublic(opts);
  const host = getHost(publicHost);

  neutrino.config.devServer.merge(merge.all([
    {
      port,
      https: false,
      contentBase: neutrino.options.source,
      hot: true,
      historyApiFallback: true,
      publicPath: '/',
      headers: {
        host: publicHost
      },
      // Only display compile duration and errors/warnings, to reduce noise when rebuilding.
      stats: {
        all: false,
        errors: true,
        timings: true,
        warnings: true
      }
    },
    opts,
    { host, public: publicHost }
  ]));
};
