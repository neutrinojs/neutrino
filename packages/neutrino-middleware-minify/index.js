const BabiliPlugin = require('babili-webpack-plugin');

module.exports = ({ config }, options = {}) => config
  .plugin('minify')
  .use(BabiliPlugin, [options.babili, options.overrides]);
