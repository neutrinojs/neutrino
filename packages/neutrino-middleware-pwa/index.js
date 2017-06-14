const OfflinePlugin = require('offline-plugin');
const merge = require('deepmerge');

module.exports = (neutrino, options = {}) => neutrino.config
  .entry('index')
    .add(require.resolve('./pwa'))
    .end()
  .plugin('pwa')
    .use(OfflinePlugin, [
      merge({
        ServiceWorker: {
          events: true
        },
        AppCache: false,
        relativePaths: false,
        excludes: ['_redirects'],
        cacheMaps: [{ match: /.*/, to: '/', requestTypes: ['navigate'] }],
        publicPath: '/'
      }, options)
    ]);
