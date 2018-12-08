const merge = require('deepmerge');

module.exports = ({ pluginId = 'pwa', ...options } = {}) => (neutrino) => {
  Object
    .keys(neutrino.options.mains)
    .forEach(key => neutrino.config.entry(key).add(require.resolve('./pwa')));

  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('offline-plugin'), [
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
