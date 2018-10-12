const { resolve } = require('path');
const { ConfigurationError } = require('neutrino/errors');

module.exports = (neutrino, { pluginId = 'html', ...options } = {}) => {
  if ('links' in options && !('template' in options)) {
    throw new ConfigurationError(
      'The default Neutrino HTML template no longer supports the "links" option. ' +
      'To set a favicon use the "favicon" option instead. For stylesheets either ' +
      'import the equivalent npm package from JS, or if using a CDN is preferred, ' +
      'then copy the default HTML template into your repository (where it can be ' +
      'customised as desired) and set the "template" option to its path.'
    );
  }

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
