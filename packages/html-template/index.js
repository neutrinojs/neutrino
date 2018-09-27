const { resolve } = require('path');

module.exports = (neutrino, { pluginId = 'html', ...options } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('html-webpack-plugin'), [
      {
        // Use a custom template that has more features (appMountId, lang) than the default:
        // https://github.com/jantimon/html-webpack-plugin/blob/master/default_index.ejs
        template: resolve(__dirname, 'template.ejs'),
        appMountId: 'root',
        lang: 'en',
        meta: {
          viewport: 'width=device-width, initial-scale=1',
          ...options.meta
        },
        ...options
      }
    ]);
};
