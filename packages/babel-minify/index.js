const BabelMinify = require('babel-minify-webpack-plugin');

module.exports = ({ config }, options = {}) => config
  .plugin('babel-minify')
  .use(BabelMinify, [options.minify, options.plugin]);
