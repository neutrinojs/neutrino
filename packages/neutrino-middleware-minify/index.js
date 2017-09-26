const BabelMinify = require('babel-minify-webpack-plugin');

module.exports = ({ config }, options = {}) => config
  .plugin('minify')
  .use(BabelMinify, [options.minify, options.overrides]);
