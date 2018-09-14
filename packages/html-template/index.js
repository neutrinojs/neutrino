const { resolve } = require('path');

const merge = require('deepmerge');

module.exports = (neutrino, { pluginId = 'html', ...options } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('html-webpack-plugin'), [
      merge({
        // Use a custom template that has more features (appMountId, lang) than the default:
        // https://github.com/jantimon/html-webpack-plugin/blob/master/default_index.ejs
        template: resolve(__dirname, 'template.ejs'),
        appMountId: 'root',
        lang: 'en',
        meta: {
          viewport: 'width=device-width, initial-scale=1'
        },
        minify: {
          useShortDoctype: true,
          keepClosingSlash: true,
          collapseWhitespace: true,
          preserveLineBreaks: true
        }
      }, options)
    ]);
};
