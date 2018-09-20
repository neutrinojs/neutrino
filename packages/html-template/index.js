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
        // These are copied from the new html-webpack-plugin defaults:
        // https://github.com/jantimon/html-webpack-plugin/pull/1048
        // Passing options.minify will overwrite these defaults entirely
        // (intentional for parity with the html-webpack-plugin implementation).
        // Remove this once we're using a new release containing that change.
        minify: process.env.NODE_ENV === 'production' && {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        },
        ...options
      }
    ]);
};
