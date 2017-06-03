const opn = require('opn');

module.exports = (neutrino, options = {}) => {
  const { config } = neutrino;
  const publicHost = process.env.HOST;
  const https = options.https;
  const protocol = https ? 'https' : 'http';
  const port = options.port || 5000;
  const serverPublic = options.public !== undefined ? Boolean(options.public) : false;
  const host = serverPublic ? '0.0.0.0' : 'localhost';
  const openInBrowser = options.open !== undefined ? Boolean(options.open) : false;
  const contentBase = options.contentBase || neutrino.options.source;

  config
    .devServer
      .host(host)
      .port(Number(port))
      .https(Boolean(https))
      .contentBase(contentBase)
      .historyApiFallback(true)
      .hot(true)
      .headers({ host: publicHost })
      .public(publicHost)
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
      })
      .when(openInBrowser, devServer => neutrino.on('start', () => {
        const https = devServer.get('https');
        const protocol = https ? 'https' : 'http';
        const host = devServer.get('host');
        const port = devServer.get('port');
        const endHost = host === '0.0.0.0' ? publicHost : host;

        opn(`${protocol}://${endHost}:${port}`);
      }))
      .end()
    .entry('index')
      .prepend(require.resolve('webpack/hot/dev-server'))
      .prepend(`${require.resolve('webpack-dev-server/client')}?${protocol}://${host}:${port}`);
};
