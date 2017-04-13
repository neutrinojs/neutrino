const BabiliPlugin = require('babili-webpack-plugin');

module.exports = ({ config }, options) => config
  .plugin('minify')
  .use(BabiliPlugin)
  .when(options, plugin => plugin.tap(() => [options.babili, options.overrides]));
