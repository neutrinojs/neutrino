const BabelMinifyPlugin = require('babili-webpack-plugin');

module.exports = ({ config }, options = {}) => config
  .plugin('babel-minify')
  .use(BabelMinifyPlugin, [options.minify, options.plugin]);
