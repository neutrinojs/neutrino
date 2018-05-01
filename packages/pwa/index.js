const OfflinePlugin = require('offline-plugin');
const merge = require('deepmerge');

module.exports = (neutrino, options = {}) => {
  Object
    .keys(neutrino.options.mains)
    .forEach(key => neutrino.config.entry(key).add(require.resolve('./pwa')));

  neutrino.config
    .plugin(options.pluginId || 'pwa')
    .use(OfflinePlugin, [
      merge({
        ServiceWorker: {
          events: true
        },
        relativePaths: false,
        excludes: ['_redirects'],
        cacheMaps: [{ match: /.*/, to: '/', requestTypes: ['navigate'] }],
        publicPath: '/'
      }, options)
    ]);
};
